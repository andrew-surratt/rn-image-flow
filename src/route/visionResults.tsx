import {GoogleCloudVisionResponse, ImageData} from '../types';
import {Linking, View} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import styles from '../styles';
import visionResultsPreview from '../component/visionResults';
import { appStorage } from '../storage/appStorage';
import {RootStackParamList} from './types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/src/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Vision Results'>
}

const VisionResults  = ({navigation}: Props) => {
  const [visionResults, setVisionResults] = useState<GoogleCloudVisionResponse | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    async function getImageData() {
      const storedResults = await appStorage.visionResults.get();
      setVisionResults(storedResults);
      const storedImageData = await appStorage.imageData.get();
      setImageData(storedImageData);
      console.log(`Image data: ${JSON.stringify(storedImageData)}`);
    }
    getImageData();
  }, []);

  /**
   * TODO: Open app based on vision results.
   */
  const openApp = () => {
    (async() => {
      if (visionResults?.responses) {
        const title = 'Parking';
        const description = visionResults?.responses[0]?.textAnnotations[0]?.description;
        const location = imageData ? `${imageData.latitude}, ${imageData.longitude}` : '';
        const getGCalDate = (addMinutes = -30) => {
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
      } else {
        console.error('Empty vision response');
      }
    })();
  };

  const startFlowEl: JSX.Element = visionResults ? (
    <Button mode="contained" onPress={openApp} uppercase={false} style={[styles.visionResultsStyle, {justifyContent: 'center'}]}>
      Start Configured Flow
    </Button>
  ) : (
    <></>
  );

  return (
    <View style={styles.contentStyle}>
      {startFlowEl}
      {visionResultsPreview()}
    </View>
  );
};

export default VisionResults;
