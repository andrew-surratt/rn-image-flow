import {cloudAPIKey} from '../config/secrets';
import config from '../config/config';
import {GoogleCloudVisionRequest, GoogleCloudVisionResponse} from './types';
import {google} from '@google-cloud/vision/build/protos/protos';
import Type = google.cloud.vision.v1.Feature.Type;

async function getGoogleVisionResult(image: string): Promise<GoogleCloudVisionResponse> {
  const googleCloudVisionRequest: GoogleCloudVisionRequest = {
    requests: [
      {
        features: [
          {type: Type.LABEL_DETECTION, maxResults: 1},
          {type: Type.TEXT_DETECTION, maxResults: 1},
        ],
        image: {
          source: {
            imageUri: image,
          },
        },
      },
    ],
  };
  const body = JSON.stringify(googleCloudVisionRequest);

  let response = await fetch(
    `${config.googleCloudVisionApi}${config.googleCloudImagePath}?${config.googleCloudKeyParam}=${cloudAPIKey}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    }
  );
  let responseJson: GoogleCloudVisionResponse = await response.json();
  console.log(`imageResponses`, responseJson);
  return responseJson;
}

export default getGoogleVisionResult;
