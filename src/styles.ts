import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'black',
  },
  contentStyle: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  imageBoxStyle: {
    margin: 10,
    flexDirection: 'column',
    alignItems: 'center',
    height: '40%',
  },
  imageStyle: {
    aspectRatio: 1,
    height: '80%',
    margin: 5,
    flex: 1,
  },
  visionButtonStyle: {
    margin: 5,
    width: '100%',
    maxHeight: '20%'
  },
  imageButtonsStyle: {
    justifyContent: 'flex-end',
    margin: 5,
    height: '10%'
  },
  visionResultsStyle: {
    margin: 5,
    flex: 1,
    width: '100%',
    maxHeight: '20%'
  },
  visionTextStyle: {
    color: 'white'
  }
});

export default styles;
