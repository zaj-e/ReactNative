import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import {DEFAULT_USER} from '../common/contants';
import { IFavoriteProduct, IProduct } from '../interfaces/product';
import {authInitialState, AuthState} from './AuthContext';

type AuthAction = 
  {type: 'signIn'; payload: any} | 
  {type: 'logout'} |
  {type: 'changeFavorite', payload: AuthState} |
  {type: 'addVisited', payload: IFavoriteProduct} |
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
    case 'addVisited':
      const exists = state.visitedProducts.some(
        vproduct =>
          vproduct.store + '_' + vproduct.model ===
          action.payload.store + '_' + action.payload.model,
      );
      console.log(exists ? 'Existe' : 'No Existe');
      if (!exists) {
        state = { ...state, visitedProducts: [...state.visitedProducts, action.payload] };
      }
      return state;
    case 'deleteVisited':
      return {
        ...state,
        visitedProducts: action.payload
      }
    default:
      return state;
  }
};
