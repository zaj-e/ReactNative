import database from '@react-native-firebase/database';
import { prefix } from '../common/contants';
import { AuthState } from '../context/AuthContext';
import { IProduct } from '../interfaces/product';

export const loadSameModelOtherStores = async (product: IProduct) => {
  const ripleyProductPromise = database()
    .ref(
      `${prefix}products/${product.category_group}/${product.category}/${
        product.sub_category
      }/RI_${product.model_store_unique_identifier.slice(3)}`,
    )
    .once('value');

  const sagaProductPromise = database()
    .ref(
      `${prefix}products/${product.category_group}/${product.category}/${
        product.sub_category
      }/SF_${product.model_store_unique_identifier.slice(3)}`,
    )
    .once('value');

  const oeschleProductPromise = database()
    .ref(
      `${prefix}products/${product.category_group}/${product.category}/${
        product.sub_category
      }/OE_${product.model_store_unique_identifier.slice(3)}`,
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
  ripleyProduct && productsArray.push(ripleyProduct);
  sagaProduct && productsArray.push(sagaProduct);
  oeschleProduct && productsArray.push(oeschleProduct);

  return productsArray.sort(
    ({product_price: a}, {product_price: b}) => +b - +a,
  );
};

export const loadFavProducts = async (user: AuthState) => {
  const responses: any[] = await Promise.all(
    user.favoriteProducts.map((fp, index) =>
      database()
        .ref(
          `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.model_store_unique_identifier}`,
        )
        .once('value'),
    ),
  );

  const productsF = responses.map(res => res.val());

  return productsF;
};

export const loadVisProducts = async (user: AuthState) => {
  const responses: any[] = await Promise.all(
    user.visitedProducts.map(
      async (fp, index) =>
        await database()
          .ref(
            `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.model_store_unique_identifier}`,
          )
          .once('value'),
    ),
  );

  const productsV = responses.map(res => res.val());

  return productsV;
};

export const verifyProductIsFavorite = async (
  user: AuthState,
  product: IProduct,
) => {
  let productIsFavorite = false;
  productIsFavorite = user.favoriteProducts.some(
    fproduct =>
      fproduct.model_store_unique_identifier ===
      product.model_store_unique_identifier,
  );

  return productIsFavorite;
};
