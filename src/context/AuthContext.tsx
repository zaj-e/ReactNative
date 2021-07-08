import auth from '@react-native-firebase/auth'
import {GoogleSignin} from '@react-native-community/google-signin';
import { AsyncStorage } from 'react-native';
import React, {createContext, useReducer} from 'react';
import {authReducer} from './authReducer';

GoogleSignin.configure({
  webClientId: '266199817839-mdhi7nj8ehv8eri3lba2e7keevsmahio.apps.googleusercontent.com',
});

export interface AuthState {
  isLoggedIn: boolean;
  email?: string;
  username?: string;
  userImage?: string;
}

export const authInitialState: AuthState = {
  isLoggedIn: false,
  email: undefined,
  username: undefined,
  userImage: undefined,
};

interface AuthContextProps {
  authState: AuthState;
  signIn: () => void;
  checkIsLoggedIn: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const signIn = async () => {
    try {
      // await GoogleSignin.hasPlayServices(); 
      // Get the user token
      const { idToken } = await GoogleSignin.signIn();
      // Create a google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in user with the credential
      const user = await auth().signInWithCredential(googleCredential);

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      console.log(JSON.stringify(user, null, 2))
      
      dispatch({type: 'signIn', payload: user});
    } catch(err) {
      console.log(err.message)
    }
  };

  const checkIsLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        console.log("IS LOGGED IN")
        const user = JSON.parse(value);
        dispatch({type: 'signIn', payload: user});
      } else {
        console.log("IS NOT LOGGED IN")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        checkIsLoggedIn
      }}>
      {children}
    </AuthContext.Provider>
  );
};
