import { AdapterId, AdapterType, Config } from './types';

const config: Config = {
  googleCloudImagePath: '/images:annotate',
  googleCloudKeyParam: 'key',
  googleCloudVisionApi: 'https://vision.googleapis.com/v1',
  googleCloudMaxResults: 4,
  adapters: [
    {
      id: AdapterId.GoogleCalendar,
      name: 'Google Calendar',
      type: AdapterType.URL,
      value: {
        urlComponents: [
          'https://www.google.com/calendar/render?action=TEMPLATE&text=',
          '${1}',
          '&details=',
          '${2}',
          '&location=',
          '${3}',
          '&dates=',
          '${4}',
          '%2F',
          '${5}',
        ],
      },
    },
  ],
  flows: [
    {
      labelAnnotations: ['Automotive parking light', 'Automotive lighting'],
      textAnnotations: [
        '2R',
        '3',
        '3R',
        '4',
        '4R',
        '5',
        '5R',
        '6',
        '6R',
        '7',
        '7R',
      ],
      action: {
        id: AdapterId.GoogleCalendar,
      },
    },
  ],
};

export default config;
