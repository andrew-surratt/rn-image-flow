import { ActivityIndicator, Button } from 'react-native-paper';
import styles from '../styles';
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { isImageInfo } from '../types';
import { uploadImage } from '../service/firebase';
import {
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';
import { appStorage } from '../storage/appStorage';
import { RootStackParamList } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/src/types';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const Home = ({ navigation }: Props) => {
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    async function getStoredImage() {
      const storedImage = await appStorage.imageUrl.get();
      if (storedImage) {
        navigation.navigate('Image Preview');
      }
    }
    getStoredImage();
  }, [navigation]);

  const imagePickerOptions: ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: MediaTypeOptions.Images,
    base64: true,
    exif: true,
  };

  const handleImage = async (pickerResult: ImagePickerResult) => {
    try {
      setUploading(true);

      if (isImageInfo(pickerResult)) {
        console.log(`Image Properties: ${JSON.stringify(pickerResult.exif)}`);
        if (pickerResult.exif?.GPSLatitude && pickerResult.exif?.GPSLongitude) {
          await appStorage.imageData.set({
            latitude: pickerResult.exif.GPSLatitude,
            longitude: pickerResult.exif.GPSLongitude,
          });
        }
        const uploadUrl: string | null = await uploadImage(pickerResult);
        if (uploadUrl) {
          await appStorage.imageUrl.set(uploadUrl);
          await appStorage.visionResults.clear();
          navigation.navigate('Image Preview');
        } else {
          console.error('Upload to firebase failed.');
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

  const openCamera = async () => {
    const pickerResult: ImagePickerResult = await launchCameraAsync(
      imagePickerOptions
    );
    console.log(`Camera result ${JSON.stringify(pickerResult)}`);
    if (isImageInfo(pickerResult)) {
      const rollUri: string = await CameraRoll.save(pickerResult.uri);
      console.log(`Image saved to ${rollUri}`);
    }

    await handleImage(pickerResult);
  };

  const openGallery = async () => {
    const pickerResult: ImagePickerResult =
      await launchImageLibraryAsync<ImagePickerOptions>(imagePickerOptions);

    await handleImage(pickerResult);
  };

  const imagePickerEl: JSX.Element = (
    <View style={styles.imageButtonsViewStyle}>
      <Button
        icon="camera"
        mode="contained"
        uppercase={false}
        onPress={openGallery}
        style={styles.imageButtonsStyle}
        labelStyle={styles.imageButtonsLabelStyle}
      >
        Choose from Gallery
      </Button>
      <Button
        icon="camera"
        mode="contained"
        uppercase={false}
        onPress={openCamera}
        style={styles.imageButtonsStyle}
        labelStyle={styles.imageButtonsLabelStyle}
      >
        Take Photo
      </Button>
    </View>
  );

  return (
    <View style={styles.contentStyle}>
      {uploading ? <ActivityIndicator /> : <></>}
      {imagePickerEl}
    </View>
  );
};

export { Home };
