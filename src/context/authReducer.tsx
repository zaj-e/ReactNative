import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import {DEFAULT_USER} from '../common/contants';
import { IFavoriteProduct, INotificationProduct, IProduct } from '../interfaces/product';
import {authInitialState, AuthState} from './AuthContext';

type AuthAction = 
  {type: 'signIn'; payload: any} | 
  {type: 'logout'} |
  {type: 'changeFavorite', payload: AuthState} |
  {type: 'changeNotification', payload: AuthState} |
  {type: 'addVisited', payload: IFavoriteProduct} |
  {type: 'deleteNotificationProduct', payload: INotificationProduct[]} |
  {type: 'deleteVisited', payload: IFavoriteProduct[]};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signIn':
      const userProfile = action.payload.user.additionalUserInfo!.profile!;
      return {
        ...state,
        uid: action.payload.user.user.uid,
        isLoggedIn: true,
        username: userProfile.name ? userProfile.name : 'Usuario',
        email: userProfile.email,
        userImage: userProfile.picture ? userProfile.picture : DEFAULT_USER,
        notificationProducts: action.payload.notProductsArr,
        favoriteProducts: action.payload.favProductsArr,
        visitedProducts: action.payload.visProductsArr
      };
    case 'logout':
      return authInitialState;
    case 'changeFavorite':
      return {
        ...state,
        favoriteProducts: action.payload.favoriteProducts,
      }
    case 'changeNotification':
      return {
        ...state,
        notificationProducts: action.payload.notificationProducts,
      }
    case 'addVisited':
      const exists = state.visitedProducts.some(
        vproduct =>
          vproduct.model_store_unique_identifier ===
          action.payload.model_store_unique_identifier,
      );
      console.log(exists ? 'Existe' : 'No Existe');
      if (!exists) {
        state = { ...state, visitedProducts: [...state.visitedProducts, action.payload] };
      }
      return state;
    case 'deleteNotificationProduct':
      return {
        ...state,
        notificationProducts: action.payload
      }
    case 'deleteVisited':
      return {
        ...state,
        visitedProducts: action.payload
      }
    default:
      return state;
  }
};
