import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IProduct} from '../interfaces/product';

interface ProductItemProps {
  item: IProduct;
}

const screenWidth = Dimensions.get('screen').width;

export const ProductItem: React.FC<ProductItemProps> = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetail', item)}>
      <View style={styles.topCardContainer}>
        <Image source={{uri: item.product_image}} style={styles.imageProduct} />
        <Text>{item.product_name} </Text>
        <View style={styles.discount}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>
            -{item.product_discount}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topCardContainer: {
    width: screenWidth * 0.4,
    margin: 5,
  },
  imageProduct: {
    width: screenWidth * 0.4,
    height: 150,
  },
  discount: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'red',
    padding: 5,
    width: 39.5,
    height: 39.5,
    borderRadius: 44 / 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
