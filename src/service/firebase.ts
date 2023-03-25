import { utils } from '@react-native-firebase/app';
import { ImageInfo } from 'expo-image-picker';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';
import config from '../config/config';

// Initialize Firebase
export const initializeFirebase = () => {
  const app = utils;
  console.log('name', app.name);
  console.log('version', app.SDK_VERSION);
};

export async function uploadToFirebase(
  imagePickerResult: ImageInfo,
  refPath = String(uuid.v4())
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    console.log('Firebase Image uuid', refPath);
    if (imagePickerResult.base64) {
      const ref = storage().ref().child(refPath);
      const task = ref.putString(imagePickerResult.base64, 'base64');

      const NETWORK_TIMEOUT_IN_SECONDS = config.networkTimeoutInSeconds;
      const THIRTY_SECONDS_AS_MS = NETWORK_TIMEOUT_IN_SECONDS * 1000;

      // If the network connection times out, cancel the task
      const timeout = setTimeout(() => {
        console.log('cancelling');
        task.cancel();
        reject('Cancelled');
      }, THIRTY_SECONDS_AS_MS);
      task.then(() => {
        console.log(`Firebase task: ${task}`);
        clearTimeout(timeout);
        resolve(refPath);
      });
    }
  });
}

export async function getDownloadUrl(
  refPath = String(uuid.v4())
): Promise<string> {
  return await storage().ref(refPath).getDownloadURL();
}

export async function uploadImage(
  pickerResult: ImagePickerResult
): Promise<string | null> {
  try {
    let refPath;
    if (!pickerResult.cancelled) {
      refPath = await uploadToFirebase(pickerResult);
      if (refPath) {
        return await getDownloadUrl(refPath);
      }
    }
  } catch (e) {
    console.error('Storage upload error', e);
  }
  return null;
}
