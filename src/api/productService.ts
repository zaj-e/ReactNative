import database from '@react-native-firebase/database';
import {prefix} from '../common/contants';
import {IProduct} from '../interfaces/product';

export const loadSameModelOtherStores = async (product: IProduct) => {
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

  return productsArray.sort(
    ({product_price: a}, {product_price: b}) => +b - +a,
  );
};
