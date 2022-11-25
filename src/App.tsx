import React, {useState} from 'react';
import {Image, Linking, SafeAreaView, ScrollView, View} from 'react-native';
import {
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import {ImagePickerResult} from 'expo-image-picker/src/ImagePicker.types';
import {
  ActivityIndicator,
  Appbar,
  Button,
  DefaultTheme,
  List,
  Provider as PaperProvider,
  Theme,
} from 'react-native-paper';

import {initializeFirebase, uploadImage} from './firebase';
import styles from './styles';
import getGoogleVisionResult from './googleVision';
import {GoogleCloudVisionResponse, ImageData, isImageInfo} from './types';

const initialVisionResults: GoogleCloudVisionResponse = {
  'responses': [{
    'labelAnnotations': [{
      'mid': '/m/0h8n1g1',
      'description': 'Automotive parking light',
      'score': 0.94150746,
      'topicality': 0.94150746
    }, {'mid': '/m/0768fx', 'description': 'Automotive lighting', 'score': 0.9212488, 'topicality': 0.9212488}],
    'textAnnotations': [{
      'locale': 'und',
      'description': '4R',
      'boundingPoly': {
        'vertices': [{'x': 929, 'y': 944}, {'x': 1299, 'y': 944}, {'x': 1299, 'y': 1270}, {
          'x': 929,
          'y': 1270
        }]
      }
    }, {
      'description': '4R',
      'boundingPoly': {
        'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {'x': 1288, 'y': 1270}, {
          'x': 929,
          'y': 1257
        }]
      }
    }],
    'fullTextAnnotation': {
      'pages': [{
        'width': 3024,
        'height': 3024,
        'blocks': [{
          'boundingBox': {
            'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
              'x': 1288,
              'y': 1270
            }, {'x': 929, 'y': 1257}]
          },
          'paragraphs': [{
            'boundingBox': {
              'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
                'x': 1288,
                'y': 1270
              }, {'x': 929, 'y': 1257}]
            },
            'words': [{
              'boundingBox': {
                'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
                  'x': 1288,
                  'y': 1270
                }, {'x': 929, 'y': 1257}]
              },
              'symbols': [{
                'boundingBox': {
                  'vertices': [{'x': 940, 'y': 944}, {'x': 1116, 'y': 950}, {
                    'x': 1105,
                    'y': 1263
                  }, {'x': 929, 'y': 1257}]
                }, 'text': '4'
              }, {
                'property': {'detectedBreak': {'type': 'LINE_BREAK'}},
                'boundingBox': {
                  'vertices': [{'x': 1116, 'y': 950}, {'x': 1299, 'y': 956}, {
                    'x': 1288,
                    'y': 1269
                  }, {'x': 1105, 'y': 1263}]
                },
                'text': 'R'
              }]
            }]
          }],
          'blockType': 'TEXT'
        }]
      }], 'text': '4R'
    }
  }]
};

const App = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string>('https://firebasestorage.googleapis.com/v0/b/intricate-karma-365022.appspot.com/o/6211d08d-8fe9-47d1-9e1b-63981c19f69e?alt=media&token=5ed6bfd2-41cc-48f1-898d-8353a4bb2d37');
  const [imageData, setImageData] = useState<ImageData | undefined>({
    latitude: '35.234855555555555',
    longitude: '-80.81829166666667',
  });
  const [visionResults, setVisionResults] =
    useState<GoogleCloudVisionResponse>(initialVisionResults);

  initializeFirebase();

  // Todo: update function names and remove fluff
  const activityIndicator = (activity: boolean): JSX.Element => {
    return activity ? <ActivityIndicator/> : <></>;
  };

  const imagePreview = (imagePreviewUri: string | undefined): JSX.Element => {
    return imagePreviewUri ? (
      <View style={styles.imageBoxStyle}>
        <Image style={styles.imageStyle} source={{uri: imagePreviewUri}}/>
        <Button
          style={styles.visionButtonStyle}
          icon="camera"
          mode="contained"
          onPress={submitToGoogle}
        >
          Start
        </Button>
      </View>
    ) : (
      <></>
    );
  };

  const imagePickerOptions: ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: MediaTypeOptions.Images,
    base64: true,
    exif: true,
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

      if (isImageInfo(pickerResult)) {
        console.log(`Image Properties: ${JSON.stringify(pickerResult.exif)}`);
        if (pickerResult.exif?.GPSLatitude && pickerResult.exif?.GPSLongitude) {
          setImageData({
            latitude: pickerResult.exif.GPSLatitude,
            longitude: pickerResult.exif.GPSLongitude,
          });
        }
        const uploadUrl: string | null = await uploadImage(pickerResult);
        if (uploadUrl) {
          setImage(uploadUrl);
        }
      } else {
        console.log('Image Picker Cancelled.');
      }
    } catch (e) {
      console.error('Image Picker error', e);
    } finally {
      setUploading(false);
    }
  };

  const submitToGoogle = async () => {
    setUploading(true);
    try {
      if (image) {
        const response: GoogleCloudVisionResponse = await getGoogleVisionResult(
          image
        );
        setVisionResults(response);
      }
    } catch (error) {
      console.log('Google Cloud error', error);
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

  /**
   * TODO: Open app based on vision results.
   */
  const openApp = () => {
    const title = 'Parking';
    const description = visionResults.responses[0]?.textAnnotations[0]?.description;
    const location = imageData ? `${imageData.latitude}, ${imageData.longitude}` : '';
    const getGCalDate = (addMinutes = 0) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + addMinutes);
      return `${now.toISOString().slice(0, 19).replaceAll(':', '').replaceAll('-', '')}Z`;
    };
    const start = getGCalDate();
    const end = getGCalDate(60);
    const googleCalDeepLink = `https://www.google.com/calendar/render`;
    const gCalActionParam = `action`;
    const gCalCreateAction = `TEMPLATE`;
    Linking.openURL(
      `${googleCalDeepLink}?${gCalActionParam}=${gCalCreateAction}&text=${title}&details=${description}&location=${location}&dates=${start}%2F${end}`
    );
  };

  /**
   * TODO: remove or format
   */
  const visionResultsPreview = () => {
    const resultsList = visionResults &&
      visionResults?.responses[0]?.labelAnnotations
        ?.map((label, key) => {
          return (
            <List.Item
              key={`label${key}`}
              title={label.description}
              description={`Score: ${label.score}, Topicality: ${label.topicality}`}
              titleStyle={styles.visionTextStyle}
              descriptionStyle={styles.visionTextStyle}
            />
          );
        })
        .concat(
          visionResults?.responses[0]?.textAnnotations?.map(
            (text, key) => (
              <List.Item
                key={`text${key}`}
                title={text.description}
                description={`Score: ${text.score}, Confidence: ${text.confidence}`}
                titleStyle={styles.visionTextStyle}
                descriptionStyle={styles.visionTextStyle}
              />
            )
          )
        );
    return <ScrollView style={styles.visionResultsStyle}>{resultsList}</ScrollView>;
  };

  const startFlowEl: JSX.Element = visionResults ? (
    <View>
      <Button mode="contained" onPress={openApp}>
        Start Configured Flow?
      </Button>
    </View>
  ) : (
    <></>
  );

  const imagePickerEl: JSX.Element = <View style={styles.imageButtonsStyle}>
    <Button icon="camera" mode="contained" onPress={openGallery}>
      Choose from Gallery
    </Button>
    <Button icon="camera" mode="contained" onPress={openCamera}>
      Take Photo
    </Button>
  </View>;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView>
        <Appbar.Header style={styles.headerStyle}>
          <Appbar.Content title="Image Flow"/>
        </Appbar.Header>
        <View style={styles.contentStyle}>
          {startFlowEl}
          {imagePreview(image)}
          {visionResultsPreview()}
          {activityIndicator(uploading)}
          {imagePickerEl}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
