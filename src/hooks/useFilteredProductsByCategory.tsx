import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useState} from 'react';
import {Filter, IProduct} from '../interfaces/product';

let lastChild: any = {
  filters: {
    product_name_key: '',
    brand_key: '',
    pricekey: '',
    sub_category_key: '',
  },
};

export const useFilteredProductsByCategory = (limit: number) => {
  const [filteredProductsCategory, setFilteredProductsCategory] = useState<
    IProduct[]
  >([]);
  const [reachedBottomCategory, setReachedBottomCategory] =
    useState<boolean>(false);

  const loadFilteredProductsByCategory = async (
    filter: string,
    url: string,
    low: number,
    high: number,
    loadMore?: boolean,
  ) => {
    lastChild['url'] = url;

    const { response, errorFound } = await filterMap(
      filter,
      ['product_name_key', 'brand_key', 'sub_category_key', 'pricekey'],
      limit,
      low,
      high,
      loadMore,
    );

    if (errorFound) {
      setReachedBottomCategory(true);
    }

    let finalResponse: FirebaseDatabaseTypes.DataSnapshot[] = [];

    response.map(res => {
      if (res && res.hasChildren()) {
        finalResponse.push(res);
      }
    });

    let products: IProduct[] = [];

    if (finalResponse.length == 0) setReachedBottomCategory(true);

    finalResponse.forEach(
      (snapshot: FirebaseDatabaseTypes.DataSnapshot, index: number) => {
        snapshot.forEach((data: any): any => {
          lastChild.filters['product_name_key'] = (
            data.val() as IProduct
          ).product_name_key;
          lastChild.filters['brand_key'] = (data.val() as IProduct).brand_key;
          lastChild.filters['sub_category_key'] = (
            data.val() as IProduct
          ).sub_category_key;
          lastChild.filters['pricekey'] = (data.val() as IProduct).pricekey;

          const eachP = data.val() as IProduct;
          const priceFloat = parseFloat(eachP.product_price.replace(/,/g, ''));

          if (priceFloat >= low && priceFloat <= high) {
            if (
              eachP.brand.includes(filter) ||
              eachP.product_name.includes(filter) ||
              eachP.sub_category.includes(filter)
            ) {
              const exists = products.find(
                prod =>
                  prod.model_store_unique_identifier ==
                  (data.val() as IProduct).model_store_unique_identifier,
              );
              !exists && products.push(data.val());
            }
          }
        });
      },
    );

    setFilteredProductsCategory(oldArray => {
      var ids = new Set(oldArray.map(d => d.model_store_unique_identifier));
      const differenceQuantity = products.filter(
        d => !ids.has(d.model_store_unique_identifier),
      ).length;
      if (differenceQuantity == 0) setReachedBottomCategory(true);
      var merged = [
        ...oldArray,
        ...products.filter(d => !ids.has(d.model_store_unique_identifier)),
      ];
      return merged;
    });
  };

  const filterMap = async (
    filter: string,
    filters: Filter[],
    limit: number,
    low: number,
    high: number,
    loadMore?: boolean,
  ): Promise<{response: FirebaseDatabaseTypes.DataSnapshot[], errorFound: boolean }> => {
    let response: FirebaseDatabaseTypes.DataSnapshot[] | any;
    let errorFound = false;

    response = await Promise.all(
      filters.map(async filterProp => {
        if (loadMore) {
          try {
            if (filterProp == 'pricekey' && low && high) {
              return await database()
                .ref(lastChild.url)
                .orderByChild(filterProp)
                .startAt(lastChild.filters[filterProp])
                .endAt(high.toLocaleString() + '\uf8ff')
                .limitToFirst(limit)
                .once('value');
            } else {
              return await database()
                .ref(lastChild.url)
                .orderByChild(filterProp)
                .startAt(lastChild.filters[filterProp])
                .endAt(filter.toUpperCase() + '\uf8ff')
                .limitToFirst(limit)
                .once('value');
            }
          } catch (error) {
            errorFound = true;
          }
          
        } else {
          console.log('entra URL', lastChild.url, 'FILTRO', filter);
          try {
            if (filterProp == 'pricekey' && low && high) {
              return await database()
                .ref(lastChild.url)
                .orderByChild(filterProp)
                .startAt(low.toLocaleString())
                .endAt(high.toLocaleString() + '\uf8ff')
                .limitToFirst(limit)
                .once('value');
            } else {
              return await database()
                .ref(lastChild.url)
                .orderByChild(filterProp)
                .startAt(filter.toUpperCase()) // includes string
                .endAt(filter.toUpperCase() + '\uf8ff')
                .limitToFirst(limit)
                .once('value');
            }
          } catch (error) {
            errorFound = true;
          }
        }
      }),
    );

    return {response, errorFound};
  };

  return {
    setReachedBottomCategory,
    reachedBottomCategory,
    filteredProductsCategory,
    loadFilteredProductsByCategory,
    setFilteredProductsCategory,
  };
};
