import {StackScreenProps} from '@react-navigation/stack';
import React, { useState } from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GridListProduct} from '../components/GridListProduct';
import {IProduct} from '../interfaces/product';
import {StackNavigationProps} from '../navigation/StackNavigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

interface ProductNotificationScreenProps
  extends StackScreenProps<
    StackNavigationProps['ProductNotificationScreen'],
    'Comparizy'
  > {}

export const ProductNotificationScreen: React.FC<ProductNotificationScreenProps> =
  ({route}) => {
    let products: IProduct[] = [];
    products = route.params.products;

    const [isGrid, setIsGrid] = useState(false);
    

    return (
      <>
        <View>
          <Text style={{textAlign: 'center', marginBottom: 10 }}>Productos actualizados</Text>
          <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => setIsGrid(grid => !grid)}>
              <Icon
                name="grid-outline"
                size={30}
                color={isGrid ? 'orange' : 'black'}
              />
            </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <GridListProduct
            isGrid={isGrid}
            products={products}
            loadMore={() => {}}
            reachedBottom={true}
            forNotificationDeletetion={true}
          />
        </View>
      </>
    );
  };

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 10,
    height: screenHeight * 0.3, // 30%
  },
  posterImage: {
    flex: 1,
  },
  mainTextIntro: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  textIntro: {
    alignSelf: 'center',
  },
  horizontalList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  horizontalDisplayContainer: {
    width: screenWidth * 0.25,
    height: screenHeight * 0.15,
    marginHorizontal: 15,
  },
  horizontalDisplay: {
    width: '100%',
    height: '100%',
  },
  horizontalDisplayStore: {
    width: screenWidth * 0.25,
    marginHorizontal: 10,
    aspectRatio: 3 / 1,
  },
  cross: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    top: 0,
    left: screenWidth * 0.35 - 25,
    zIndex: 999,
    elevation: 14,
  },
  tag: {
    marginTop: 10,
    backgroundColor: '#BEBEBE',
    width: screenWidth * 0.35,
    borderRadius: 5,
    padding: 4,
  },
});
