import {
  GoogleCloudVisionError,
  GoogleCloudVisionResponse,
  ImageData,
  isGoogleCloudVisionError,
} from '../types';
import { Linking, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, List, Text } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import styles from '../styles';
import { appStorage } from '../storage/appStorage';
import { RootStackParamList } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/src/types';
import config from '../config/config';
import { Adapter, AdapterType } from '../config/types';

const VisionResultsPreview = (
  visionResults?: GoogleCloudVisionResponse | GoogleCloudVisionError,
  targetFlow?: Adapter
) => {
  const resultsList = isGoogleCloudVisionError(visionResults) ? (
    <Text style={styles.visionResultsTextStyle}>
      {JSON.stringify(visionResults?.error?.message)}
    </Text>
  ) : (
    <List.AccordionGroup>
      <List.Accordion titleStyle={styles.visionTextStyle} title={'Labels Found'} id={1}>
        {visionResults?.responses[0]?.labelAnnotations?.map((label, key) => {
          return (
            <List.Item
              key={`label${key}`}
              title={label.description}
              description={`${label.score?.toFixed(2)?.slice(2)}%`}
              style={styles.visionListItemStyle}
              titleStyle={styles.visionTextStyle}
              descriptionStyle={styles.visionTextStyle}
            />
          );
        })}
      </List.Accordion>
      <List.Accordion title={'Text Found'} titleStyle={styles.visionTextStyle} id={2}>
        {visionResults?.responses[0]?.textAnnotations?.map((text, key) => (
          <List.Item
            key={`text${key}`}
            title={text.description}
            style={styles.visionListItemStyle}
            titleStyle={styles.visionTextStyle}
            descriptionStyle={styles.visionTextStyle}
          />
        ))}
      </List.Accordion>
    </List.AccordionGroup>
  );
  return (
    <ScrollView style={styles.visionResultsStyle}>{resultsList}</ScrollView>
  );
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Vision Results'>;
};

const calculateBestTargetFlow = (
  visionResults?: GoogleCloudVisionResponse
): Adapter | undefined => {
  for (const flow of config.flows) {
    const visionResponse = visionResults?.responses[0];
    const containsLabel: boolean =
      visionResponse?.labelAnnotations?.some(
        (label) =>
          label.description && flow.labelAnnotations.includes(label.description)
      ) || false;
    const containsText: boolean =
      visionResponse?.textAnnotations?.some(
        (text) =>
          text.description && flow.textAnnotations.includes(text.description)
      ) || false;
    if (containsLabel || containsText) {
      return config.adapters.find((adapter) => adapter.id === flow.action.id);
    }
  }
  return undefined;
};

/**
 * Get date formatted for google calendar.
 * @param addMinutes
 */
const getGCalDate = (addMinutes = -30) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + addMinutes);
  return `${now
    .toISOString()
    .slice(0, 19)
    .replaceAll(':', '')
    .replaceAll('-', '')}Z`;
};

const VisionResults = ({}: Props) => {
  const [visionResults, setVisionResults] =
    useState<GoogleCloudVisionResponse>();
  const [imageData, setImageData] = useState<ImageData>();
  const [targetFlow, setTargetFlow] = useState<Adapter>();

  useEffect(() => {
    async function getImageData() {
      const storedResults = (await appStorage.visionResults.get()) || undefined;
      setVisionResults(storedResults);
      const storedImageData = (await appStorage.imageData.get()) || undefined;
      setImageData(storedImageData);
      console.log(`Image data: ${JSON.stringify(storedImageData)}`);
      setTargetFlow(calculateBestTargetFlow(storedResults));
    }
    getImageData();
  }, []);

  /**
   * TODO: Open app based on vision results.
   */
  const openApp = () => {
    (async () => {
      if (visionResults?.responses && targetFlow) {
        if (targetFlow) {
          if (targetFlow.type === AdapterType.URL) {
            // Todo: extract configuration
            const variables: Record<string, string> = {
              '1': 'Parking',
              '2':
                visionResults?.responses[0]?.textAnnotations[0]?.description ||
                '',
              '3': imageData
                ? `${imageData.latitude}, ${imageData.longitude}`
                : '',
              '4': getGCalDate(),
              '5': getGCalDate(60),
            };
            type AdapterUrlType = {
              urlComponents: string[];
            };
            const variablePattern: RegExp = new RegExp(`^(\\\${)(\\w+)(})\$`);
            const url = (targetFlow.value as AdapterUrlType).urlComponents
              .map((component) => {
                const regExpMatchArray = component.match(variablePattern);
                console.log(`Matched component ${component}: ${regExpMatchArray}`);
                if (regExpMatchArray && variables[regExpMatchArray[2]]) {
                  return variables[regExpMatchArray[2]];
                }
                return component;
              })
              .join('');
            console.log(`Linking to URL ${url}`);
            Linking.openURL(url);
          } else {
            console.error(`No adapter for ${targetFlow.type}`);
          }
        } else {
          console.error('No adapter configured.');
        }
      } else {
        console.error('No configured target flow.');
      }
    })();
  };

  const startFlowEl: JSX.Element =
    visionResults && targetFlow ? (
      <Button
        mode="contained"
        icon="tools"
        onPress={openApp}
        uppercase={false}
        style={styles.visionResultsButtonStyle}
        labelStyle={styles.imageButtonsLabelStyle}
      >
        {`Open ${targetFlow.name}`}
      </Button>
    ) : (
      <ActivityIndicator />
    );

  return (
    <View style={styles.contentStyle}>
      {VisionResultsPreview(visionResults, targetFlow)}
      {startFlowEl}
    </View>
  );
};

export default VisionResults;
