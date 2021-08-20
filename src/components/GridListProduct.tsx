import React from 'react';
import {ActivityIndicator, FlatList, Platform} from 'react-native';
import {IProduct} from '../interfaces/product';
import { ProductItem } from './ProductItem';

interface GridListProductProps {
  products: IProduct[];
  reachedBottom: boolean;
  loadMore: () => void;
}

export const GridListProduct: React.FC<GridListProductProps> = ({
  products,
  reachedBottom,
  loadMore
}) => {
    
  return (
    <FlatList
      data={products}
      renderItem={({ item, index }) => <ProductItem item={item} />}
      keyExtractor={item => item.model_store_unique_identifier! + item.model}
      numColumns={2}
      columnWrapperStyle={{
          justifyContent: 'space-between'
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() =>
        !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={Platform.OS == 'ios' ? 0.5 : 0.5}
    />
  );
};
