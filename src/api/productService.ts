import database from '@react-native-firebase/database';
import {prefix} from '../common/contants';
import {AuthState} from '../context/AuthContext';
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

export const loadFavProducts = async (user: AuthState) => {
  const responses: any[] = await Promise.all(
    user.favoriteProducts.map((fp, index) =>
      database()
        .ref(
          `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.store}_${fp.model}`,
        )
        .once('value'),
    ),
  );

  const productsF = responses.map(res => res.val());

  return productsF;
};

export const loadVisProducts = async (user: AuthState) => {
  const responses: any[] = await Promise.all(
    user.visitedProducts.map((fp, index) =>
      database()
        .ref(
          `${prefix}products/${fp.category_group}/${fp.category}/${fp.sub_category}/${fp.store}_${fp.model}`,
        )
        .once('value'),
    ),
  );

  const productsV = responses.map(res => res.val());

  return productsV;
}

export const verifyProductIsFavorite = async (
  user: AuthState,
  product: IProduct,
) => {
  let productIsFavorite = false;
  productIsFavorite = user.favoriteProducts.some(
    fproduct => fproduct.store + '_' + fproduct.model === product.store + '_' + product.model,
  );

  return productIsFavorite;
};

// export const changeFavoriteProduct = async (
//   user: AuthState,
//   product: IProduct,
// ) => {
//   const ref2 = database().ref(`${prefix}users/${user.uid}/favoriteProducts`);

//   const productIndex = user.favoriteProducts.findIndex(
//     fproduct => fproduct.store + '_' + fproduct.model === product.store + '_' + product.model,
//   );

//   productIndex !== -1
//     ? user.favoriteProducts.splice(productIndex, 1)
//     : user.favoriteProducts.push({
//         category: product.category,
//         category_group: product.category_group,
//         model: product.model,
//         store: product.store,
//         sub_category: product.sub_category,
//       });

//   await ref2.remove();

//   await Promise.all(
//     user.favoriteProducts.map(fp => {
//       ref2.update({
//         [`${fp.store}_${fp.model}`]: fp,
//       });
//     }),
//   );
// };
