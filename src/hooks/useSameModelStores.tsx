import database from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {prefix} from '../common/contants';
import {IProduct} from '../interfaces/product';

export const useSameModelStores = (product: IProduct, limit: number) => {
  const [compareProducts, setCompareProducts] = useState<IProduct[]>([]);

  const loadSameModelOtherStores = async () => {
    const ripleyProductPromise = database()
      .ref(
        `${prefix}products/${product.category_group}/${product.category}/${product.sub_category}/RI_${product.model}`,
      )
      .once('value');

    const sagaProductPromise = database()
      .ref(
        `${prefix}products/${product.category_group}/${product.category}/${product.sub_category}/SF_${product.model}`,
      )
      .once('value');

    const oeschleProductPromise = database()
      .ref(
        `${prefix}products/${product.category_group}/${product.category}/${product.sub_category}/OE_${product.model}`,
      )

      .once('value');

    const response = await Promise.all([
      ripleyProductPromise,
      sagaProductPromise,
      oeschleProductPromise,
    ]);

    const ripleyProduct = response[0].val();
    const sagaProduct = response[1].val();
    const oeschleProduct = response[2].val();

    let productsArray: IProduct[] = [];
    productsArray.push({
      ...(ripleyProduct && {...ripleyProduct}),
      ...(sagaProduct && {...sagaProduct}),
      ...(oeschleProduct && {...oeschleProduct}),
    });

    productsArray.sort(({product_price: a}, {product_price: b}) => +b - +a);

    setCompareProducts(productsArray);
  };

  useEffect(() => {
    loadSameModelOtherStores();
  }, [])

  return {
    compareProducts
  }
};
