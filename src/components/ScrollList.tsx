import React, { useEffect, useState } from 'react';
import {ActivityIndicator, FlatList, Platform} from 'react-native';
import {IProduct} from '../interfaces/product';
import {ProductItem} from './ProductItem';

interface ScrollListProps {
  products: IProduct[];
  reachedBottom: boolean;
  horizontal?: boolean;
  loadMore: () => void;
  productItemStyle?: 'horizontal' | 'vertical';
  hasDeleteButton?: boolean;
  typeFilter?: 'visited' | 'favorite'
}

export const ScrollList: React.FC<ScrollListProps> = ({
  products,
  reachedBottom,
  loadMore,
  horizontal = false,
  productItemStyle = 'vertical',
  hasDeleteButton = false,
  typeFilter
}) => {
  console.log("PRODUCTS", products);
  return (
    <FlatList
      data={products}
      renderItem={({item, index}) => (
        <ProductItem
          productItemStyle={productItemStyle}
          hasDeleteButton={hasDeleteButton}
          item={item}
          typeFilter={typeFilter}
        />
      )}
      keyExtractor={(item, index) => item.model_store_unique_identifier + index}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() =>
        !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
    />
  );
};
