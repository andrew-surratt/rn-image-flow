import { utils } from '@react-native-firebase/app';

// Initialize Firebase
export const initializeFirebase = () => {
  const app = utils;
  console.log('name', app.name);
  console.log('version', app.SDK_VERSION);
  console.log('options', app().app.options);
};
