import {GoogleCloudVisionResponse, ImageData} from '../types';

export interface Config {
  googleCloudImagePath: string,
  googleCloudKeyParam: string,
  googleCloudVisionApi: string,
  initialImage: string,
  initialImageData: ImageData,
  initialVisionResults: GoogleCloudVisionResponse,
}
