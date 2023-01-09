import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppStorage, StorageHandler} from './types';
import {GoogleCloudVisionResponse, ImageData} from '../types';

function storageHandler<T>(
  key: string,
  getter: () => Promise<T | null>,
  setter: (value: T) => Promise<void>,
  clear: () => Promise<void>
  ): StorageHandler<T> {
  return ({
    key,
    get: getter,
    set: setter,
    clear,
  });
}

const stringStorageHandler = (key: string) => storageHandler<string>(
  key,
  () => AsyncStorage.getItem(key),
  (value: string) => AsyncStorage.setItem(key, value),
  () => AsyncStorage.removeItem(key),
);

function jsonStorageHandler<T>(key: string): StorageHandler<T> {
  return storageHandler<T>(
    key,
    async () => {
      const storedItem: string | null = await AsyncStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : storedItem;
    },
    (value: T) => AsyncStorage.setItem(key, JSON.stringify(value)),
    () => AsyncStorage.removeItem(key),
  );
}

const appStorage: AppStorage = ({
  imageUrl: stringStorageHandler('@imageUrl_Key'),
  imageData: jsonStorageHandler<ImageData>('@imageData_Key'),
  visionResults: jsonStorageHandler<GoogleCloudVisionResponse>('@visionResults_Key'),
});

export { appStorage };
