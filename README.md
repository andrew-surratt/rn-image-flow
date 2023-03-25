# React Native Image Flow
Leverages computer vision to create configurable mobile workflows based on images.

![App Demo](https://github.com/andrew-surratt/rn-image-flow/blob/feature/google-vision/documentation/app-demo.gif)

## Prerequisites

* Android Device/Emulator (v12, 13)
* Google Cloud account with configured API key, firebase, and google vision enabled

## Usage

### Configure
Copy `secrets_example.js` to `secrets.js` and enter your Google cloud API key.

### Install
```bash
npm i 
```

### Start
```bash
npm run start:reset-cache
```

and in another window
```bash
npm run android
```
