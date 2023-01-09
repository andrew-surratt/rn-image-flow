import {GoogleCloudVisionResponse, ImageData} from '../types';
import getGoogleVisionResult from '../googleVision';
import {Image, View} from 'react-native';
import {ActivityIndicator, Appbar, Button} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import styles from '../styles';
import { appStorage } from '../storage/appStorage';
import {RootStackParamList} from './types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/src/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Image Preview'>
}

const ImagePreview  = ({navigation}: Props) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    async function getImageData() {
      const storedResults = await appStorage.visionResults.get();
      const storedImageData = await appStorage.imageData.get();
      if (storedResults && storedImageData) {
        navigation.navigate('Vision Results');
      }

      const storedImage = await appStorage.imageUrl.get();
      setImage(storedImage);
      console.log(`Image URL: ${storedImage}`);
    }
    getImageData();
  }, []);

  const submitToGoogle = async () => {
    setUploading(true);
    try {
      if (image) {
        const response: GoogleCloudVisionResponse = await getGoogleVisionResult(
          image
        );
        await appStorage.visionResults.set(response);
        navigation.navigate('Vision Results');
      }
    } catch (error) {
      console.log('Google Cloud error', error);
    } finally {
      setUploading(false);
    }
  };

  const imagePreview = (imagePreviewUri: string | null): JSX.Element => {
    return imagePreviewUri ? (
      <View style={styles.imageBoxStyle}>
        <Image style={styles.imageStyle} source={{uri: imagePreviewUri}}/>
        <Button
          style={styles.visionButtonStyle}
          icon="camera"
          mode="contained"
          uppercase={false}
          onPress={submitToGoogle}
        >
          Start
        </Button>
      </View>
    ) : (
      <></>
    );
  };

  return (
    <View style={styles.contentStyle}>
      {imagePreview(image)}
      {uploading ? <ActivityIndicator/> : <></>}
    </View>
  );
};

export default ImagePreview;
