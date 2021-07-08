import React from 'react';
import {FlatList} from 'react-native';
import {IProduct} from '../interfaces/product';
import { ProductItem } from './ProductItem';

interface GridListProductProps {
  products: IProduct[];
}

export const GridListProduct: React.FC<GridListProductProps> = ({products}) => {
    
  return (
    <FlatList
      data={products}
      renderItem={({ item, index }) => <ProductItem item={item} />}
      keyExtractor={item => item.id!}
      numColumns={2}
      columnWrapperStyle={{
          justifyContent: 'space-between'
      }}
    />
  );
};
