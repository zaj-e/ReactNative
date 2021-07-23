import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {Button, Image, Platform, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {IProduct} from '../interfaces/product';
import {HomeScreen} from '../screens/HomeScreen';
import {ProductDetail} from '../screens/ProductDetail';

export type StackNavigationProps = {
  HomeScreen: undefined;
  ProductDetail: IProduct;
};

const Stack = createStackNavigator();

export const StackNavigation: React.FC<StackNavigationProps> = ({}) => {
  const {authState, signIn, logout, checkIsLoggedIn} = useContext(AuthContext);

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        title: "Comparizy",
        headerTitleStyle: {
          textAlign: 'center',
          color: 'orange',
          fontWeight: 'bold',
          marginRight: Platform.OS === 'android' && authState.isLoggedIn ? 50 : 0
        },
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen
        name="Comparizy"
        options={{
          headerRightContainerStyle: {marginRight: 15},
          headerRight: () =>
            !authState.isLoggedIn ? (
              <Button onPress={signIn} title="Iniciar sesión" color="#0096FF" />
             ) : (<Button onPress={logout} title="Cerrar sesión" color="#0096FF" />),
          headerLeftContainerStyle: {marginLeft: 15},
          headerLeft: () => {
            return authState.userImage ? (
              <Image
                source={{uri: authState.userImage}}
                style={styles.userIcon}
              />
            ) : (
              <Image
                source={require('../images/user.png')}
                style={styles.userIcon}
              />
            );
          },
        }}
        component={HomeScreen}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
