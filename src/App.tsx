import React, { useState } from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import {
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';
import {
  ActivityIndicator,
  Appbar,
  Button,
  DefaultTheme,
  List,
  Provider as PaperProvider,
  Text,
  Theme,
} from 'react-native-paper';

import {getDownloadUrl, initializeFirebase, uploadImage} from './firebase';
import styles from './styles';
import getGoogleVisionResult from './googleVision';
import {GoogleCloudVisionResponse} from './types';


const initialVisionResults: GoogleCloudVisionResponse = {
  'responses': [
    {
      'labelAnnotations': [
        {
          'mid': '/m/083vt',
          'description': 'Wood',
          'score': 0.8930967,
          'topicality': 0.8930967
        }
      ],
      textAnnotations: [
        {
          'description': 'Test',
          'score': 0.8930967,
          'confidence': 0.8930967,
        }
      ]
    }
  ]
};
const App = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const [visionResults, setVisionResults] = useState<GoogleCloudVisionResponse>(initialVisionResults);

  initializeFirebase();

  const initialImage = '630bfd8d-6d04-4fe0-8e41-6eafb414de84';
  getDownloadUrl(initialImage).then((url) => {
    console.log(`Image URL ${url}`);
    setImage(url);
  });

  // Todo: update function names and remove fluff
  const uploadIndicator = () => {
    if (uploading) {
      return <ActivityIndicator />;
    }
  };

  const imageBox = () => {
    if (!image) {
      return;
    }

    return (
      <View style={styles.imageBoxStyle}>
        <Image style={styles.imageStyle} source={{ uri: image }} />
        <Button style={styles.visionButtonStyle} icon="camera" mode="contained" onPress={submitToGoogle}>Start</Button>
      </View>
    );
  };

  const imagePickerOptions: ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: MediaTypeOptions.Images,
    base64: true,
  };

  const openCamera = async () => {
    const pickerResult: ImagePickerResult = await launchCameraAsync(
      imagePickerOptions
    );

    await handleImage(pickerResult);
  };

  const openGallery = async () => {
    const pickerResult: ImagePickerResult =
      await launchImageLibraryAsync<ImagePickerOptions>(imagePickerOptions);

    await handleImage(pickerResult);
  };

  const handleImage = async (pickerResult: ImagePickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl: string | null = await uploadImage(pickerResult);
        if (uploadUrl) {
          setImage(uploadUrl);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  // Todo: Use google lib
  const submitToGoogle = async () => {
    setUploading(true);
    try {
      if (image) {
        const response: GoogleCloudVisionResponse = await getGoogleVisionResult(image);
        console.log(response);
        setVisionResults(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const theme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'gray',
    },
  };


  return (
    <PaperProvider theme={theme}>
      <SafeAreaView>
        <Appbar.Header>
          <Appbar.Content title="Image Flow" />
        </Appbar.Header>
        <View style={styles.contentStyle}>
          {imageBox()}
          {visionResults && visionResults?.responses[0]?.labelAnnotations?.map((label, key) =>
            (<List.Item
              key={`label${key}`}
              title={label.description}
              description={
                `Score: ${label.score}, Topicality: ${label.topicality}`
              }
            />)
          ).concat(visionResults?.responses[0]?.textAnnotations?.map((text, key) =>
            (<List.Item
              key={`label${key}`}
              title={text.description}
              description={
                `Score: ${text.score}, Confidence: ${text.confidence}`
              }
            />)
          ))}
          {uploadIndicator()}
          <View style={styles.imageButtonsStyle}>
            <Button icon="camera" mode="contained" onPress={openGallery}>
              Choose from Gallery
            </Button>
            <Button icon="camera" mode="contained" onPress={openCamera}>
              Take Photo
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
