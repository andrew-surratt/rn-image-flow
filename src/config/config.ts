import { Config } from './types';

const config: Config = {
  googleCloudImagePath: `/images:annotate`,
  googleCloudKeyParam: `key`,
  googleCloudVisionApi: `https://vision.googleapis.com/v1`,
  initialImage: 'https://firebasestorage.googleapis.com/v0/b/intricate-karma-365022.appspot.com/o/6211d08d-8fe9-47d1-9e1b-63981c19f69e?alt=media&token=5ed6bfd2-41cc-48f1-898d-8353a4bb2d37',
  initialImageData: {
    latitude: '35.234855555555555',
    longitude: '-80.81829166666667',
  },
  initialVisionResults: {
    'responses': [{
      'labelAnnotations': [{
        'mid': '/m/0h8n1g1',
        'description': 'Automotive parking light',
        'score': 0.94150746,
        'topicality': 0.94150746
      }, {'mid': '/m/0768fx', 'description': 'Automotive lighting', 'score': 0.9212488, 'topicality': 0.9212488}],
      'textAnnotations': [{
        'locale': 'und',
        'description': '4R',
        'boundingPoly': {
          'vertices': [{'x': 929, 'y': 944}, {'x': 1299, 'y': 944}, {'x': 1299, 'y': 1270}, {
            'x': 929,
            'y': 1270
          }]
        }
      }, {
        'description': '4R',
        'boundingPoly': {
          'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {'x': 1288, 'y': 1270}, {
            'x': 929,
            'y': 1257
          }]
        }
      }],
      'fullTextAnnotation': {
        'pages': [{
          'width': 3024,
          'height': 3024,
          'blocks': [{
            'boundingBox': {
              'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
                'x': 1288,
                'y': 1270
              }, {'x': 929, 'y': 1257}]
            },
            'paragraphs': [{
              'boundingBox': {
                'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
                  'x': 1288,
                  'y': 1270
                }, {'x': 929, 'y': 1257}]
              },
              'words': [{
                'boundingBox': {
                  'vertices': [{'x': 940, 'y': 944}, {'x': 1299, 'y': 957}, {
                    'x': 1288,
                    'y': 1270
                  }, {'x': 929, 'y': 1257}]
                },
                'symbols': [{
                  'boundingBox': {
                    'vertices': [{'x': 940, 'y': 944}, {'x': 1116, 'y': 950}, {
                      'x': 1105,
                      'y': 1263
                    }, {'x': 929, 'y': 1257}]
                  }, 'text': '4'
                }, {
                  'property': {'detectedBreak': {'type': 'LINE_BREAK'}},
                  'boundingBox': {
                    'vertices': [{'x': 1116, 'y': 950}, {'x': 1299, 'y': 956}, {
                      'x': 1288,
                      'y': 1269
                    }, {'x': 1105, 'y': 1263}]
                  },
                  'text': 'R'
                }]
              }]
            }],
            'blockType': 'TEXT'
          }]
        }], 'text': '4R'
      }
    }]
  }
};

export default config;
