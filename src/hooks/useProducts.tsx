import { useEffect, useState } from 'react';
import { IProduct } from '../interfaces/product';
import { processPromises } from '../utils/promiseCreator';

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);

  const getProducts = async () => {
    // add all sub categories
    const products =  await processPromises();
    let productsArray = [];

    for (let [key, value] of Object.entries(products as any)) {
      (value as IProduct).id = key;
      productsArray.push(value as IProduct);
    }

    productsArray.sort(
      ({product_discount: a}, {product_discount: b}) => +b - +a,
    );

    setProducts(productsArray.slice(0, 10)); // obtener los 10 primeros

    setIsLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {products, isLoading};
};
