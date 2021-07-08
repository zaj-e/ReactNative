
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DEFAULT_USER } from '../common/contants';
import {authInitialState, AuthState} from './AuthContext';

type AuthAction = {type: 'signIn'; payload: FirebaseAuthTypes.UserCredential} | {type: 'logout'};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signIn':
      const userProfile = action.payload.additionalUserInfo!.profile!;
      return {
        ...state,
        isLoggedIn: true,
        username: userProfile.name ? userProfile.name : 'Usuario',
        email: userProfile.email,
        userImage: userProfile.picture ? userProfile.picture : DEFAULT_USER,
      };
    case 'logout':
      return authInitialState;
    default:
      return state;
  }
};
