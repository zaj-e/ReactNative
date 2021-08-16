import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {createContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import {prefix} from '../common/contants';
import {IFavoriteProduct, IProduct} from '../interfaces/product';
import {authReducer} from './authReducer';

GoogleSignin.configure({
  webClientId:
    '266199817839-mdhi7nj8ehv8eri3lba2e7keevsmahio.apps.googleusercontent.com',
});

export interface AuthState {
  uid?: string;
  isLoggedIn: boolean;
  email?: string;
  username?: string;
  userImage?: string;
  favoriteProducts: IFavoriteProduct[];
  visitedProducts: IFavoriteProduct[];
}

export const authInitialState: AuthState = {
  uid: undefined,
  isLoggedIn: false,
  email: undefined,
  username: undefined,
  userImage: undefined,
  favoriteProducts: [],
  visitedProducts: [],
};
interface AuthContextProps {
  authState: AuthState;
  signIn: (action: any) => void;
  checkIsLoggedIn: (action: any) => void;
  logout: () => void;
  changeFavoriteProduct: (product: IProduct) => Promise<void>;
  addVisitedProduct: (product: IProduct) => Promise<void>;
  deleteVisitedProduct: (product: IProduct) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const signIn = async (action: any) => {
    console.log('signIn')
    try {
      // Get the user token
      const {idToken} = await GoogleSignin.signIn();
      // Create a google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in user with the credential
      const user: any = await auth().signInWithCredential(googleCredential);

      await AsyncStorage.setItem('user', JSON.stringify(user));

      const ref = database().ref(`${prefix}users/${user.user.uid}`);

      ref
        .update({
          name: user.additionalUserInfo!.profile!.name
            ? user.additionalUserInfo!.profile!.name
            : 'Usuario',
        })
        .then(() => console.log('Usuario creado'));

      // Favorite products populate

      const favProducts = await database()
        .ref(`${prefix}users/${user.user.uid}/favoriteProducts`)
        .once('value');

      const favProductsArr = [];

      const favProd2 = favProducts.val();

      if (favProd2 !== null) {
        for (let [key, value] of Object.entries(favProd2 as any)) {
          favProductsArr.push(value);
        }
      }

      // Visited products populate

      const visProducts = await database()
        .ref(`${prefix}users/${user.user.uid}/visitedProducts`)
        .once('value');

      const visProductsArr = [];

      const visProd2 = visProducts.val();

      if (visProd2 !== null) {
        for (let [key, value] of Object.entries(visProd2 as any)) {
          visProductsArr.push(value);
        }
      }

      action && action();

      dispatch({
        type: 'signIn',
        payload: {user, favProductsArr, visProductsArr},
      });
    } catch (err) {
      console.log('ERRORSASO', err.message);
    }
  };

  const checkIsLoggedIn = async (action: any) => {
    console.log('checkIsLoggedIn')
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);

        // Favorite products populate

        const favProducts = await database()
          .ref(`${prefix}users/${user.user.uid}/favoriteProducts`)
          .once('value');

        const favProductsArr = [];

        const favProd2 = favProducts.val();

        if (favProd2 !== null) {
          for (let [key, value] of Object.entries(favProd2 as any)) {
            favProductsArr.push(value);
          }
        }

        // Visited products populate

        const visProducts = await database()
          .ref(`${prefix}users/${user.user.uid}/visitedProducts`)
          .once('value');

        const visProductsArr = [];

        const visProd2 = visProducts.val();

        if (visProd2 !== null) {
          for (let [key, value] of Object.entries(visProd2 as any)) {
            visProductsArr.push(value);
          }
        }

        action && action();

        dispatch({
          type: 'signIn',
          payload: {user, favProductsArr, visProductsArr},
        });
      }
    } catch (error) {
      console.log('HII', error);
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      dispatch({type: 'logout'});
    } catch (error) {
      console.log('CTM', error);
    }
  };

  const changeFavoriteProduct = async (product: IProduct) => {
    console.log('changeFavoriteProduct')
    const ref = database().ref(
      `${prefix}users/${authState.uid}/favoriteProducts`,
    );

    console.log("PRoducts favorite", authState.favoriteProducts)

    const productIndex = authState.favoriteProducts.findIndex(
      fproduct =>
        fproduct.store + '_' + fproduct.model ===
        product.store + '_' + product.model,
    );

    const userCopy = {...authState};

    productIndex !== -1
      ? userCopy.favoriteProducts.splice(productIndex, 1)
      : userCopy.favoriteProducts.push({
          category: product.category,
          category_group: product.category_group,
          model: product.model,
          store: product.store,
          sub_category: product.sub_category,
        });

    await ref.remove();

    await Promise.all(
      userCopy.favoriteProducts.map(fp => {
        ref.update({
          [`${fp.store}_${fp.model}`]: fp,
        });
      }),
    );

    dispatch({type: 'changeFavorite', payload: userCopy});
  };

  const addVisitedProduct = async (product: IProduct) => {
    console.log('addVisitedProduct')
    const ref = database().ref(
      `${prefix}users/${authState.uid}/visitedProducts`,
    );

    const exists = authState.visitedProducts.some(
      vproduct =>
        vproduct.store + '_' + vproduct.model ===
        product.store + '_' + product.model,
    );

    if (!exists) {
      const newProduct: IFavoriteProduct = {
        category: product.category,
        category_group: product.category_group,
        model: product.model,
        store: product.store,
        sub_category: product.sub_category,
      };

      await ref.update({
        [`${newProduct.store}_${newProduct.model}`]: newProduct,
      });

      dispatch({type: 'addVisited', payload: newProduct});
    }
  };

  const deleteVisitedProduct = async (product: IProduct) => {
    console.log('deleteVisitedProduct')
    const ref = database().ref(
      `${prefix}users/${authState.uid}/visitedProducts`,
    );

    const userCopy = {...authState};

    userCopy.visitedProducts = userCopy.visitedProducts.filter(
      vproduct =>
        vproduct.store + '_' + vproduct.model !==
        product.store + '_' + product.model,
    );

    await ref.remove();

    await Promise.all(
      userCopy.visitedProducts.map(fp => {
        ref.update({
          [`${fp.store}_${fp.model}`]: fp,
        });
      }),
    );

    dispatch({type: 'deleteVisited', payload: userCopy.visitedProducts});
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        logout,
        checkIsLoggedIn,
        changeFavoriteProduct,
        addVisitedProduct,
        deleteVisitedProduct,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
