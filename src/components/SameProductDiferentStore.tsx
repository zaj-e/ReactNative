import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {IProduct} from '../interfaces/product';

interface SameProductDiferentStoreProps {
  item: IProduct;
}

export const SameProductDiferentStore: React.FC<SameProductDiferentStoreProps> = ({item}) => {

  let logo = '';
  let logoName = '';
  switch (item.store) {
    case 'SF':
      logo = require('../images/falabellaLogo.png');
      logoName = 'Falabella';
      break;
    case 'OE':
      logo = require('../images/OechsleLogo.jpeg');
      logoName = 'Oeschsle';
      break;
    case 'RI':
      logo = require('../images/ripleyLogo.png');
      logoName = 'Ripley';
      break;
  }

  return (
    <TouchableOpacity onPress={() => Linking.openURL(item.product_detail)}>
      <View style={styles.relatedProductContainer}>
        <View style={{flex: 1}}>
          <Image
            source={logo}
            style={styles.logoIcon}
          />
          <Text style={{marginLeft: 5}}>{logoName}</Text>
        </View>

        <Text style={{flex: 3, marginTop: 15}}>{item.product_name}</Text>
        <Text style={{marginTop: 15}}>S/ {item.product_price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  relatedProductContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C6',
    paddingBottom: 12,
  },
  logoIcon: {
    flex: 1,
    width: '85%',
    height: 50,
    marginLeft: 0,
    resizeMode: 'contain',
  },
});
