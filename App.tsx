import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { TabNavigator } from './src/navigation/TabNavigator';

interface AppProps {}

export const App: React.FC<AppProps> = ({}) => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TabNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};
