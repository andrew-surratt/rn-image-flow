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
import { AdapterType, Flow, FlowAction } from '../config/types';

const VisionResultsPreview = (
  visionResults?: GoogleCloudVisionResponse | GoogleCloudVisionError
) => {
  const resultsList = isGoogleCloudVisionError(visionResults) ? (
    <Text style={styles.visionResultsTextStyle}>
      {JSON.stringify(visionResults?.error?.message)}
    </Text>
  ) : (
    <List.AccordionGroup>
      <List.Accordion
        titleStyle={styles.visionTextStyle}
        title={'Labels Found'}
        id={1}
      >
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
      <List.Accordion
        title={'Text Found'}
        titleStyle={styles.visionTextStyle}
        id={2}
      >
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
): Flow => {
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
      flow.action.adapter = config.adapters.find(
        (adapter) => adapter.id === flow.action.id
      );
      return flow;
    }
  }
  config.defaultFlow.action.adapter = config.adapters.find(
    (adapter) => adapter.id === config.defaultFlow.action.id
  );
  return config.defaultFlow;
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
  const [targetFlow, setTargetFlow] = useState<Flow>();

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

  const findActionValue = (
    action: FlowAction,
    id: string,
    defaultValue: string
  ): string =>
    action?.values?.find((value) => value.id === id)?.value ?? defaultValue;

  const openApp = () => {
    (async () => {
      const action = targetFlow?.action;
      if (visionResults?.responses && action) {
        const adapter = action.adapter;
        if (adapter) {
          if (adapter.type === AdapterType.URL) {
            const variables: Record<string, string> = {
              '1': findActionValue(action, '1', 'Note'),
              '2':
                visionResults?.responses[0]?.textAnnotations[0]?.description ||
                '',
              '3':
                imageData && imageData.latitude && imageData.longitude
                  ? `${imageData.latitude}, ${imageData.longitude}`
                  : '',
              '4': getGCalDate(),
              '5': getGCalDate(30),
            };
            type AdapterUrlType = {
              urlComponents: string[];
            };
            const variablePattern: RegExp = new RegExp('^(\\${)(\\w+)(})$');
            const url = (adapter.value as AdapterUrlType).urlComponents
              .map((component) => {
                const regExpMatchArray = component.match(variablePattern);
                console.log(
                  `Matched component ${component}: ${regExpMatchArray}`
                );
                const regexVariableIdx = 2;
                if (
                  regExpMatchArray &&
                  variables[regExpMatchArray[regexVariableIdx]]
                ) {
                  return variables[regExpMatchArray[regexVariableIdx]];
                }
                return component;
              })
              .join('');
            console.log(`Linking to URL ${url}`);
            Linking.openURL(url);
          } else {
            console.error(`No adapter for ${adapter.type}`);
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
        {`Open ${targetFlow?.action?.adapter?.name}`}
      </Button>
    ) : (
      <ActivityIndicator />
    );

  return (
    <View style={styles.contentStyle}>
      {VisionResultsPreview(visionResults)}
      {startFlowEl}
    </View>
  );
};

export default VisionResults;
