import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { useState } from 'react';
import {
  categories,
  groupCategories,
  prefix
} from '../common/contants';
import { Filter, IProduct } from '../interfaces/product';

let lastChild: any = {
  filters: {
    product_name_key: '',
    brand_key: '',
    product_price_key: '',
    sub_category_key: '',
  },
};

export const useFilteredProductsByCategory = (
  limit: number,
) => {
  const [filteredProductsCategory, setFilteredProductsCategory] = useState<IProduct[]>([]);
  const [reachedBottomCategory, setReachedBottomCategory] = useState<boolean>(false);

  const loadFilteredProductsByCategory = async (filter: string, url: string, loadMore?: boolean) => {
    lastChild['url'] = url;

    console.log('lastChild', lastChild);

    let response: FirebaseDatabaseTypes.DataSnapshot[];

    response = await filterMap(
      filter, 
      ['product_name_key', 'brand_key', 'sub_category_key'],
      limit,
      loadMore,
    );

    let finalResponse: FirebaseDatabaseTypes.DataSnapshot[] = [];

    response.map(res => {
      if (res && res.hasChildren()) {
        finalResponse.push(res);
      }
    });

    console.log('finalResponse', finalResponse);

    let products: IProduct[] = [];

    finalResponse.forEach((snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      snapshot.forEach((data: any): any => {
        if (snapshot.numChildren() !== limit) {
          setReachedBottomCategory(true);
        }

        lastChild.filters['product_name_key'] = (
          data.val() as IProduct
        ).product_name_key;
        lastChild.filters['brand_key'] = (data.val() as IProduct).brand_key;
        lastChild.filters['sub_category_key'] = (
          data.val() as IProduct
        ).sub_category_key;

        const exists = products.find(prod => prod.model_store_unique_identifier == (data.val() as IProduct).model_store_unique_identifier);
        !exists && products.push(data.val());
      });
    });
    setFilteredProductsCategory(oldArray => [...oldArray, ...products]);
  };

  const filterMap = async (
    filter: string,
    filters: Filter[],
    limit: number,
    loadMore?: boolean,
  ): Promise<FirebaseDatabaseTypes.DataSnapshot[]> => {
    let finalResponse: FirebaseDatabaseTypes.DataSnapshot[];

    finalResponse = await Promise.all(
      filters.map(async filterProp => {
        if (loadMore) {
          return await database()
            .ref(lastChild.url)
            .orderByChild(filterProp)
            .startAt(lastChild.filters[filterProp])
            .endAt(filter + '\uf8ff')
            .limitToFirst(limit)
            .once('value');
        } else {
          console.log("entra URL", lastChild.url, "FILTRO", filter)
          return await database()
            .ref(lastChild.url)
            .orderByChild(filterProp)
            // .startAt(filter) // includes string
            // .endAt(filter + '\uf8ff')
            .limitToFirst(limit)
            .once('value');
        } 
      }),
    );

    return finalResponse;
  };

  return {
    setReachedBottomCategory,
    reachedBottomCategory,
    filteredProductsCategory,
    loadFilteredProductsByCategory,
    setFilteredProductsCategory,
  };
};
