import {google} from '@google-cloud/vision/build/protos/protos';
import Type = google.cloud.vision.v1.Feature.Type;

export interface VisionApiFeature {
  type: Type,
  maxResults?: number
}

export interface VisionApiRequest {
  features: VisionApiFeature[];
  image: {
    source: {
      imageUri: string
    }
  }
}

export interface GoogleCloudVisionRequest {
  requests: VisionApiRequest[]
}


export interface GoogleCloudVisionResponse {
  responses: [
    {
      labelAnnotations: google.cloud.vision.v1.IEntityAnnotation[]
      textAnnotations: google.cloud.vision.v1.IEntityAnnotation[]
    }
  ]
}
