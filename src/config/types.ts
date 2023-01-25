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

export interface FlowAction {
  id: AdapterId;
}

export interface Flow {
  labelAnnotations: string[];
  textAnnotations: string[];
  action: FlowAction;
}

export interface Config {
  googleCloudImagePath: string;
  googleCloudKeyParam: string;
  googleCloudMaxResults: number;
  googleCloudVisionApi: string;
  adapters: Adapter[];
  flows: Flow[];
}
