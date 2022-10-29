import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';
import {Provider as PaperProvider, List, Appbar} from 'react-native-paper';

import { cloudAPIKey } from '../config/secrets';
import { initializeFirebase } from './firebase';

initializeFirebase();

type LabelAnnotations = {
  id: string;
  description: string;
};
type State = {
  image: string | null;
  googleResponse: null | {
    responses: [
      {
        labelAnnotations: LabelAnnotations;
      }
    ];
  };
  uploading: boolean;
};
export default class App extends React.Component {
  state: State = {
    image: null,
    uploading: false,
    googleResponse: null,
  };

  async componentDidMount() {
    // await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    getDownloadUrl('630bfd8d-6d04-4fe0-8e41-6eafb414de84').then((url) =>
      this.setState({
        image: url,
      })
    );
    let { image } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.getStartedContainer}>
            {image ? null : (
              <Text style={styles.getStartedText}>Google Cloud Vision</Text>
            )}
          </View>

          <View style={styles.helpContainer}>
            <Button
              onPress={this._pickImage}
              title="Pick an image from camera roll"
            />

            <Button onPress={this._takePhoto} title="Take a photo" />
            {this.state.googleResponse && (
              <FlatList
                data={this.state.googleResponse.responses[0].labelAnnotations}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={({ item }) => <Text>Item: {item.description}</Text>}
              />
            )}
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}
          </View>
        </ScrollView>
      </View>
    );
  }

  organize = (array: string[]) => {
    return array.map(function (item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image, googleResponse } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 20,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => this.submitToGoogle()}
          title="Analyze!"
        />

        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        />

        <Text>Raw JSON:</Text>

        {googleResponse && (
          <Text
            onPress={this._copyToClipboard}
            onLongPress={this._share}
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}
          >
            {JSON.stringify(googleResponse)}
          </Text>
        )}
      </View>
    );
  };

  _keyExtractor = (item: LabelAnnotations) => item.id;

  _renderItem = (item: LabelAnnotations) => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  _share = () => {
    Share.share({
      message: JSON.stringify(this.state.googleResponse?.responses),
      title: 'Check it out',
      url: this.state.image ?? '',
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image ?? '');
    alert('Copied to clipboard');
  };

  _takePhoto = async () => {
    let pickerResult: ImagePickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult: ImagePickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
            ],
            image: {
              source: {
                imageUri: image,
              },
            },
          },
        ],
      });
      let response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${cloudAPIKey}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: body,
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

async function getBlob(uri: string) {
  return await new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    } catch (e) {
      console.error('http request', e);
    }
  });
}

async function uploadBlob(blob: Blob, refPath = String(uuid.v4())) {
  console.log('uuid', refPath);
  const ref = storage().ref().child(refPath);
  console.log('blob', blob);
  await ref.put(blob);
  return refPath;
}

async function getDownloadUrl(refPath = String(uuid.v4())) {
  return await storage().ref(refPath).getDownloadURL();
}

async function uploadImageAsync(uri: string) {
  const blob = await getBlob(uri);

  try {
    const refPath = await uploadBlob(blob);
    return await getDownloadUrl(refPath);
  } catch (e) {
    console.error('Storage upload', e);
  } finally {
    blob.close();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});
