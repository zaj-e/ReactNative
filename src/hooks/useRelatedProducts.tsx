import React, {useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {IProduct} from '../interfaces/product';
import {prefix} from '../common/contants';

let lastChild: string = '';
// let reachedBottom = false;

export const useRelatedProducts = (product: IProduct, limit: number) => {
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const loadRelatedProducts = (loadMore?: boolean) => {
    const ref = database().ref(
      `${prefix}products/${product.category_group}/${product.category}/${product.sub_category}`,
    );

    if (loadMore) { // configrar pricekey en la app the scraping (funciona)
      ref
        .orderByChild('pricekey')
        .limitToFirst(limit)
        .startAt(lastChild)
        .on('value', async snapshot => {
          await prepareData(snapshot, ref);
        });
    } else {
      ref
        .orderByChild('product_price')
        .limitToFirst(limit)
        .on('value', async snapshot => {
          await prepareData(snapshot, ref);
        });
    }
  };

  const prepareData = async (
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
    ref: FirebaseDatabaseTypes.Reference,
  ) => {
    const relatedProductsFetched: IProduct[] = [];
    snapshot.forEach((data: any): any => {
      if (snapshot.numChildren() !== limit) {
        setReachedBottom(true);
      }
      lastChild = data.val().pricekey;
      relatedProductsFetched.push(data.val());
    });

    !reachedBottom && relatedProductsFetched.pop();
    setRelatedProducts(oldArray => [...oldArray, ...relatedProductsFetched]);
  };

  useEffect(() => {
    loadRelatedProducts();
  }, []);

  return {
    setReachedBottom,
    reachedBottom,
    relatedProducts,
    loadRelatedProducts,
  };
};
