import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'black',
  },
  contentStyle: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageBoxStyle: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  imageStyle: {
    aspectRatio: 1,
    maxHeight: '50%',
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-evenly'
  },
  visionButtonStyle: {
    marginTop: 20,
    marginBottom: 30,
    flexBasis: 'auto',
    flexGrow: 3,
    flexShrink: 1,
    justifyContent: 'space-evenly'
  },
  imageButtonsViewStyle: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageButtonsStyle: {
    margin: 10,
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  visionResultsStyle: {
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  visionTextStyle: {
    color: 'white'
  }
});

export default styles;
