import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeFirebase } from './service/firebase';
import { Home } from './route/home';
import ImagePreview from './route/imagePreview';
import VisionResults from './route/visionResults';
import { theme } from './styles';

const Stack = createNativeStackNavigator();

const App = () => {
  initializeFirebase();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Image Preview" component={ImagePreview} />
          <Stack.Screen name="Vision Results" component={VisionResults} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
