import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';
import {StackNavigation} from './src/navigation/StackNavigation';

interface AppProps {}

export const App: React.FC<AppProps> = ({}) => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};
