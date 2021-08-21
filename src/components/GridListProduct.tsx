import React from 'react';
import {ActivityIndicator, FlatList, Platform} from 'react-native';
import {IProduct} from '../interfaces/product';
import {ProductItem} from './ProductItem';

interface GridListProductProps {
  isGrid: boolean;
  products: IProduct[];
  reachedBottom: boolean;
  loadMore: () => void;
}

export const GridListProduct: React.FC<GridListProductProps> = ({
  isGrid,
  products,
  reachedBottom,
  loadMore,
}) => {
  return (
    <>
      {isGrid ? (
        <FlatList
          key={'_'}
          data={products}
          renderItem={({item, index}) => <ProductItem item={item} />}
          keyExtractor={item => item.model_store_unique_identifier}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            if (reachedBottom) console.log('REACHED BOTTOM!!!');
            return !reachedBottom ? (
              <ActivityIndicator color="red" size={100} />
            ) : null;
          }}
          onEndReached={(info: {distanceFromEnd: number}) => {
            console.log(info);
            loadMore();
          }}
          onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
        />
      ) : (
        <FlatList
          key={'#'}
          data={products}
          renderItem={({item, index}) => <ProductItem item={item} />}
          keyExtractor={item => item.model_store_unique_identifier}
          numColumns={1}
          style={{alignSelf: 'center'}}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            if (reachedBottom) console.log('REACHED BOTTOM!!!');
            return !reachedBottom ? (
              <ActivityIndicator color="red" size={100} />
            ) : null;
          }}
          onEndReached={(info: {distanceFromEnd: number}) => {
            console.log(info);
            loadMore();
          }}
          onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
        />
      )}
    </>
  );
};
