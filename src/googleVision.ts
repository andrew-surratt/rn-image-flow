import { cloudAPIKey } from '../config/secrets';
import config from '../config/config';
import { GoogleCloudVisionRequest, GoogleCloudVisionResponse } from './types';
import { google } from '@google-cloud/vision/build/protos/protos';
import Type = google.cloud.vision.v1.Feature.Type;

async function getGoogleVisionResult(
  image: string
): Promise<GoogleCloudVisionResponse> {
  const googleCloudVisionRequest: GoogleCloudVisionRequest = {
    requests: [
      {
        features: [
          // TODO: make configurable
          { type: Type.LABEL_DETECTION, maxResults: 2 },
          { type: Type.TEXT_DETECTION, maxResults: 2 },
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

  const response = await fetch(
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
  const responseJson: GoogleCloudVisionResponse = await response.json();
  console.log(`Google Cloud response: ${JSON.stringify(responseJson)}`);
  return responseJson;
}

export default getGoogleVisionResult;
