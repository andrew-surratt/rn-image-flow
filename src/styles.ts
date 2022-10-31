import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'column',
    alignContent: 'center',
    width: '100%',
    height: '100%'
  },
  imageBoxStyle: {
    margin: 10,
    flexDirection: 'column',
    flex: 1,
  },
  imageStyle: {aspectRatio: 1, height: undefined, width: '100%', margin: 5, flex: 1},
  visionButtonStyle: {margin: 5, flex: 1, width: '100%',},
  imageButtonsStyle: {justifyContent: 'flex-end', margin: 5},
});

export default styles;
