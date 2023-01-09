import {List, Text} from 'react-native-paper';
import styles from '../styles';
import {ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appStorage} from '../storage/appStorage';
import {GoogleCloudVisionResponse} from '../types';

/**
 * TODO: remove or format
 */
const visionResultsPreview = () => {
  const [visionResults, setVisionResults] = useState<GoogleCloudVisionResponse | null>();

  useEffect(() => {
    async function getVisionResults() {
      const storedResults = await appStorage.visionResults.get();
      setVisionResults(storedResults);
    }
    getVisionResults();
  }, []);

  const resultsList = visionResults?.responses ?
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
      ) : <Text style={{color: 'black'}}>{JSON.stringify(visionResults?.error?.message)}</Text>;
  return <ScrollView style={[styles.visionResultsStyle, {alignContent: 'flex-end'}]}>{resultsList}</ScrollView>;
};

export default visionResultsPreview;
