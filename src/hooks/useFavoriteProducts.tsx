import database from '@react-native-firebase/database';
import { useEffect, useState } from 'react';
import { prefix } from '../common/contants';
import { AuthState } from '../context/AuthContext';
import { IProduct } from '../interfaces/product';

export const useFavoriteProducts = (user: AuthState) => {
  const [favoriteProducts, setFavoriteProducts] = useState<IProduct[]>([]); 

  async function loadFavProducts() {
    const responses: any = await Promise.all(
      user.favoriteProducts.map(fp => {
        database()
          .ref(
            `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.model_store_unique_identifier}`,
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
