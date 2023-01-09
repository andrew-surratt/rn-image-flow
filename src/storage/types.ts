import {GoogleCloudVisionResponse, ImageData} from '../types';

export interface StorageHandler<T> {
  key: string,
  get: () => Promise<T | null>,
  set: (value: T) => Promise<void>,
  clear: () => Promise<void>
}

export interface AppStorage {
  imageUrl: StorageHandler<string>,
  imageData: StorageHandler<ImageData>,
  visionResults: StorageHandler<GoogleCloudVisionResponse>,
}
