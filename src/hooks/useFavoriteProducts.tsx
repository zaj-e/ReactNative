import React, {useContext, useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {IProduct} from '../interfaces/product';
import {prefix} from '../common/contants';
import {AuthContext, AuthState} from '../context/AuthContext';

export const useFavoriteProducts = (user: AuthState) => {
  const [favoriteProducts, setFavoriteProducts] = useState<IProduct[]>([]); 

  async function loadFavProducts() {
    const responses: any = await Promise.all(
      user.favoriteProducts.map(fp => {
        database()
          .ref(
            `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.store}_${fp.model}`,
          )
          .once('value');
      }),
    );

    const productsF: IProduct[] = responses.map((res: any, index: number) => {
      res[index].val();
    });
    setFavoriteProducts(productsF);
  }

  useEffect(() => {
    (async () => {
        console.log("I am loading")
        await loadFavProducts();
    })();
   
  }, [user.favoriteProducts.length]);

  return {
    favoriteProducts,
  };
};
