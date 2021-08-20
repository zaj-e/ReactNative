import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useState} from 'react';
import {
  categories,
  groupCategories,
  prefix,
  subCategories,
} from '../common/contants';
import {urls} from '../common/urls';
import {Filter, IProduct} from '../interfaces/product';

let lastChild = {
  url: {
    [`${prefix}products/${groupCategories.TECNOLOGIA}/${categories.COMPUTADORAS}/${subCategories.LAPTOPS}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.OLED}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.QLED}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.COCINA}/${subCategories.COCINA_DE_PIE}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.LAVADORAS}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.SECADORAS}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
    [`${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.REFRIGERACION}/${subCategories.REFIGERADORAS}`]:
      {
        product_name_key: '',
        sub_category_key: '',
        brand_key: '',
        product_price_key: '',
      },
  },
};
// let reachedBottom = false;

const filterMap = async (
  filter: string,
  filters: Filter[],
  limit: number,
  loadMore?: boolean,
): Promise<FirebaseDatabaseTypes.DataSnapshot[][]> => {
  let finalResponse: FirebaseDatabaseTypes.DataSnapshot[][];

  finalResponse = await Promise.all(
    filters.map(async filterProp => {
      if (loadMore) {
        return (await Promise.all(
          urls.map(async url => {
            if (lastChild.url[url][filterProp] !== '') {
              return await database()
                .ref(url)
                .orderByChild(filterProp)
                .startAt(lastChild.url[url][filterProp])
                .endAt(filter + '\uf8ff')
                .limitToFirst(limit)
                .once('value');
            }
          }),
        )) as FirebaseDatabaseTypes.DataSnapshot[];
      } else {
        return (await Promise.all(
          urls.map(async url => {
            return await database()
              .ref(url)
              .orderByChild(filterProp)
              .startAt(filter) // includes string
              .endAt(filter + '\uf8ff')
              .limitToFirst(limit)
              .once('value');
          }),
        )) as FirebaseDatabaseTypes.DataSnapshot[];
      }
    }),
  );

  return finalResponse;
};

export const useFilteredProducts = (limit: number) => {
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const loadFilteredProducts = async (filter: string, loadMore?: boolean) => {
    let response: FirebaseDatabaseTypes.DataSnapshot[][];

    response = await filterMap(
      filter,
      [
        'product_name_key',
        'brand_key',
        'sub_category_key',
      ],
      limit,
      loadMore,
    );

    let finalResponse: FirebaseDatabaseTypes.DataSnapshot[] = [];

    response.map(resArr => {
      resArr.map(res => {
        if (res && res.hasChildren()) {
          finalResponse.push(res);
        }
      });
    });

    console.log(finalResponse);

    let products: IProduct[] = [];

    finalResponse.forEach((snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      snapshot.forEach((data: any): any => {
        if (snapshot.numChildren() !== limit) {
          setReachedBottom(true);
        }

        lastChild.url[`/${(snapshot.ref as any).path.toString()}`][
          'product_name_key'
        ] = (data.val() as IProduct).product_name_key;
        lastChild.url[`/${(snapshot.ref as any).path.toString()}`][
          'brand_key'
        ] = (data.val() as IProduct).brand_key;
        lastChild.url[`/${(snapshot.ref as any).path.toString()}`][
          'sub_category_key'
        ] = (data.val() as IProduct).sub_category_key;

        products.push(data.val());
      });
    });
    setFilteredProducts(oldArray => [...oldArray, ...products]);
  };

  return {
    setReachedBottom,
    reachedBottom,
    filteredProducts,
    loadFilteredProducts,
    setFilteredProducts,
  };
};
