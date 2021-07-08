import React, {useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {IProduct} from '../interfaces/product';
import { prefix } from '../common/contants';

let lastChild: string = '';
let reachedBottom = false;

export const useRelatedProducts = (product: IProduct, limit: number) => {
    const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
    
  const loadRelatedProducts = (loadMore?: boolean) => {

    const ref = database().ref(
      `${prefix}products/${product.category_group}/${product.category}/${product.sub_category}`,
    );

    if (loadMore) {
        console.log("LOADING MORE")
        console.log("lastChild", lastChild)
        console.log("limit", limit)
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
    // relatedProductsFetched: IProduct[],
    ref: FirebaseDatabaseTypes.Reference,
  ) => {
    const relatedProductsFetched: IProduct[] = [];
    let updates: any = {};
    snapshot.forEach((data: any): any => {
      if (snapshot.numChildren() !== limit) {
        reachedBottom = true;
      }
      lastChild = data.val().product_price + '_' + data.key;
      updates[`/${data.key}/pricekey`] = lastChild;
      relatedProductsFetched.push(data.val());
    }); 
    await ref.update(updates);

    console.log("lastChildLAST", lastChild)

    !reachedBottom && relatedProductsFetched.pop();
    setRelatedProducts(oldArray => [...oldArray, ...relatedProductsFetched]);
  };

  useEffect(() => {
    loadRelatedProducts();
  }, []);

  return {
    reachedBottom,
    relatedProducts,
    loadRelatedProducts
  }
};
