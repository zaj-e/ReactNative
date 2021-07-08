import database from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {
  COMPUTADORAS,
  LAPTOPS,
  LED,
  prefix,
  TECNOLOGIA,
  TELEVISORES,
} from '../common/contants';
import {IProduct} from '../interfaces/product';

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);

  const getProducts = async () => { // add all sub categories
    const laptopsPromise = database()
      .ref(`${prefix}products/${TECNOLOGIA}/${COMPUTADORAS}/${LAPTOPS}`)
      .orderByChild('product_discount')
      .limitToLast(5)
      .once('value');
      
    const LEDSPromise = database()
      .ref(`${prefix}products/${TECNOLOGIA}/${TELEVISORES}/${LED}`)
      .orderByChild('product_discount')
      .limitToLast(5)
      .once('value');

    const response = await Promise.all([laptopsPromise, LEDSPromise]);

    const laptops = response[0].val();
    const LEDS = response[1].val();

    let products = {...laptops, ...LEDS}
    let productsArray = [];

    for (let [key, value] of Object.entries(products as any)) {
      (value as IProduct).id = key;
      productsArray.push(value as IProduct);
    }

    productsArray.sort(
      ({product_discount: a}, {product_discount: b}) => +b - +a,
    );

    setProducts(productsArray);

    setIsLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {products, isLoading};
};
