import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {createContext, useReducer} from 'react';
import {AsyncStorage} from 'react-native';
import {prefix} from '../common/contants';
import {
  IFavoriteProduct,
  INotificationProduct,
  IProduct,
} from '../interfaces/product';
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
  notificationProducts: INotificationProduct[];
}

export const authInitialState: AuthState = {
  uid: undefined,
  isLoggedIn: false,
  email: undefined,
  username: undefined,
  userImage: undefined,
  favoriteProducts: [],
  visitedProducts: [],
  notificationProducts: [],
};
interface AuthContextProps {
  authState: AuthState;
  signIn: (action: any) => void;
  checkIsLoggedIn: (action: any) => void;
  logout: () => void;
  changeFavoriteProduct: (product: IProduct) => Promise<void>;
  changeNotificaionProduct: (product: IProduct) => Promise<void>;
  addVisitedProduct: (product: IProduct) => Promise<void>;
  deleteNotificationProduct: (product: IProduct) => Promise<void>;
  deleteVisitedProduct: (product: IProduct) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const signIn = async (action: any) => {
    console.log('signIn');
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

      // Notification products populate

      const notProducts = await database()
        .ref(`${prefix}users/${user.user.uid}/notificationProducts`)
        .once('value');

      const notProductsArr = [];

      const notProd2 = notProducts.val();

      if (notProd2 !== null) {
        for (let [key, value] of Object.entries(notProd2 as any)) {
          notProductsArr.push(value);
        }
      }

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
        payload: {user, notProductsArr, favProductsArr, visProductsArr},
      });
    } catch (err) {
      console.log('ERRORSASO', err.message);
    }
  };

  const checkIsLoggedIn = async (action: any) => {
    console.log('checkIsLoggedIn');
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);

        // Notification products populate

        const notProducts = await database()
          .ref(`${prefix}users/${user.user.uid}/notificationProducts`)
          .once('value');

        const notProductsArr = [];

        const notProd2 = notProducts.val();

        if (notProd2 !== null) {
          for (let [key, value] of Object.entries(notProd2 as any)) {
            notProductsArr.push(value);
          }
        }

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
          payload: {user, notProductsArr, favProductsArr, visProductsArr},
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
    console.log('changeFavoriteProduct');
    const ref = database().ref(
      `${prefix}users/${authState.uid}/favoriteProducts`,
    );

    console.log('PRoducts favorite', authState.favoriteProducts);

    const productIndex = authState.favoriteProducts.findIndex(
      fproduct =>
        fproduct.model_store_unique_identifier ===
        product.model_store_unique_identifier,
    );

    const userCopy = {...authState};

    productIndex !== -1
      ? userCopy.favoriteProducts.splice(productIndex, 1)
      : userCopy.favoriteProducts.push({
          category: product.category,
          category_group: product.category_group,
          model_store_unique_identifier: product.model_store_unique_identifier,
          sub_category: product.sub_category,
        });

    await ref.remove();

    await Promise.all(
      userCopy.favoriteProducts.map(fp => {
        ref.update({
          [`${fp.model_store_unique_identifier}`]: fp,
        });
      }),
    );

    dispatch({type: 'changeFavorite', payload: userCopy});
  };

  const changeNotificaionProduct = async (product: IProduct) => {
    console.log('changeNotificationProduct');
    const ref = database().ref(
      `${prefix}users/${authState.uid}/notificationProducts`,
    );

    console.log('PRoducts notificatio', authState.notificationProducts);

    const productIndex = authState.notificationProducts.findIndex(
      nproduct =>
        nproduct.model_store_unique_identifier ===
        product.model_store_unique_identifier,
    );

    const userCopy = {...authState};

    productIndex !== -1
      ? userCopy.notificationProducts.splice(productIndex, 1)
      : userCopy.notificationProducts.push({
          category: product.category,
          category_group: product.category_group,
          model_store_unique_identifier: product.model_store_unique_identifier,
          sub_category: product.sub_category,
          last_date:
            product.price_history[product.price_history.length - 1].fecha,
        });

    await ref.remove();

    await Promise.all(
      userCopy.notificationProducts.map(np => {
        ref.update({
          [`${np.model_store_unique_identifier}`]: np,
        });
      }),
    );

    dispatch({type: 'changeNotification', payload: userCopy});
  };

  const addVisitedProduct = async (product: IProduct) => {
    console.log('addVisitedProduct');
    const ref = database().ref(
      `${prefix}users/${authState.uid}/visitedProducts`,
    );

    const exists = authState.visitedProducts.some(
      vproduct =>
        vproduct.model_store_unique_identifier ==
        product.model_store_unique_identifier,
    );

    if (!exists) {
      const newProduct: IFavoriteProduct = {
        category: product.category,
        category_group: product.category_group,
        model_store_unique_identifier: product.model_store_unique_identifier,
        sub_category: product.sub_category,
      };

      await ref.update({
        [`${newProduct.model_store_unique_identifier}`]: newProduct,
      });

      dispatch({type: 'addVisited', payload: newProduct});
    }
  };

  const deleteNotificationProduct = async (product: IProduct) => {
    console.log('deleteNotificationProduct');
    const ref = database().ref(
      `${prefix}users/${authState.uid}/notificationProducts`,
    );

    const userCopy = {...authState};

    userCopy.notificationProducts = userCopy.notificationProducts.filter(
      nproduct =>
      nproduct.model_store_unique_identifier !==
        product.model_store_unique_identifier,
    );

    await ref.remove();

    await Promise.all(
      userCopy.notificationProducts.map(np => {
        ref.update({
          [`${np.model_store_unique_identifier}`]: np,
        });
      }),
    );

    dispatch({type: 'deleteNotificationProduct', payload: userCopy.notificationProducts});
  }

  const deleteVisitedProduct = async (product: IProduct) => {
    console.log('deleteVisitedProduct');
    const ref = database().ref(
      `${prefix}users/${authState.uid}/visitedProducts`,
    );

    const userCopy = {...authState};

    userCopy.visitedProducts = userCopy.visitedProducts.filter(
      vproduct =>
        vproduct.model_store_unique_identifier !==
        product.model_store_unique_identifier,
    );

    await ref.remove();

    await Promise.all(
      userCopy.visitedProducts.map(fp => {
        ref.update({
          [`${fp.model_store_unique_identifier}`]: fp,
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
        changeNotificaionProduct,
        addVisitedProduct,
        deleteNotificationProduct,
        deleteVisitedProduct,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
