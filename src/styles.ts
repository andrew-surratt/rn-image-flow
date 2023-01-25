import { StyleSheet } from 'react-native';
import { DefaultTheme, Theme } from 'react-native-paper';

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
    height: '100%',
  },
  imageStyle: {
    aspectRatio: 1,
    maxHeight: '50%',
    flexBasis: 'auto',
    flexGrow: 1,
  },
  visionButtonStyle: {
    marginTop: 300,
  },
  imageButtonsViewStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
  imageButtonsStyle: {
    margin: 10,
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  imageButtonsLabelStyle: {
    fontSize: 25,
  },
  visionResultsStyle: {
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    alignContent: 'flex-end',
  },
  visionResultsButtonStyle: {
    margin: 10,
  },
  visionResultsTextStyle: {
    color: 'black',
  },
  visionTextStyle: {
    color: 'black',
  },
  visionListItemStyle: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    margin: 1,
  },
});

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(0, 104, 116)',
    accent: 'rgb(255, 255, 255)',
    text: 'rgb(25, 28, 29)',
    error: 'rgb(186, 26, 26)',
    notification: 'rgb(65, 0, 2)',
    background: 'rgb(250, 253, 253)',
    surface: 'rgb(250, 253, 253)',
    onSurface: 'rgb(25, 28, 29)',
    backdrop: 'rgb(0, 0, 0)',
    disabled: 'rgb(0, 0, 0)',
    placeholder: 'rgb(239, 241, 241)',
  },
  roundness: 10,
};

export { theme };

export default styles;
