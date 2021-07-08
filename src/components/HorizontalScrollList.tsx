import React from 'react';
import {ActivityIndicator, FlatList, Platform} from 'react-native';
import {IProduct} from '../interfaces/product';
import { ProductItem } from './ProductItem';

interface HorizontalScrollList {
  products: IProduct[];
  reachedBottom: boolean;
  loadMore: () => void;
}

export const HorizontalScrollList: React.FC<HorizontalScrollList> = ({products, reachedBottom, loadMore}) => {
    
  return (
    <FlatList
      data={products}
      renderItem={({ item, index }) => <ProductItem item={item} />}
      keyExtractor={item => item.model_store_unique_identifier}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
          ListFooterComponent={() =>
            !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
    />
  );
};
