export enum AdapterType {
  URL = 'URL',
}

export enum AdapterId {
  GoogleCalendar = 'google-calendar',
}

export interface Adapter {
  id: AdapterId;
  name: string;
  type: AdapterType;
  value: object;
}

export interface ActionValue {
  id: string;
  value: string;
}

export interface FlowAction {
  id: AdapterId;
  adapter?: Adapter;
  values?: ActionValue[];
}

export interface Flow {
  labelAnnotations: string[];
  textAnnotations: string[];
  action: FlowAction;
}

export interface Config {
  networkTimeoutInSeconds: number;
  googleCloudImagePath: string;
  googleCloudKeyParam: string;
  googleCloudMaxResults: number;
  googleCloudVisionApi: string;
  adapters: Adapter[];
  flows: Flow[];
  defaultFlow: Flow;
}
