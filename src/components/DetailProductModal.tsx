import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {loadSameModelOtherStores} from '../api/productService';
import withPreventDoubleClick from '../hoc/withPreventDoubleClick';
import {IProduct} from '../interfaces/product';
import {SameProductDiferentStore} from './SameProductDiferentStore';

const screenWidth = Dimensions.get('screen').width;
const ButtonDebounce: any = withPreventDoubleClick(TouchableOpacity);

interface DetailProductModalProps {
  closeModal: () => void;
  backdropOpacity: number;
  isVisible: boolean;
  item: IProduct;
}

export const DetailProductModal: React.FC<DetailProductModalProps> = ({
  closeModal,
  backdropOpacity,
  isVisible,
  item,
}) => {
  const [compareProducts, setCompareProducts] = useState<IProduct[]>();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let resp = await loadSameModelOtherStores(item);
      setCompareProducts(resp);
    })();
  }, []);
  return (
    <Modal
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      backdropOpacity={backdropOpacity}
      isVisible={isVisible}>
      <View
        style={{
          width: '90%',
          backgroundColor: 'white',
          padding: 16,
          height: '90%',
          paddingBottom: 15,
          minHeight: '20%',
          alignSelf: 'center',
        }}>
        <View>
          <Image
            source={{uri: item.product_image}}
            style={styles.imageProduct}
          />
          <View style={styles.discount}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>
              -{item.product_discount}%
            </Text>
          </View>
          <Text style={{textAlign: 'center', marginTop: 10}}>
            {item.product_name}
          </Text>
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            {item.product_price}
          </Text>
          <Text style={{textAlign: 'center'}}>{item.brand}</Text>

          <View style={styles.relatedProductsContainer}>
            <Text style={{flex: 1, fontWeight: 'bold'}}>Tienda</Text>
            <Text style={{flex: 1, fontWeight: 'bold'}}>Precio Online</Text>
          </View>

          {compareProducts?.map((item, index) => (
            <SameProductDiferentStore
              key={item.model_store_unique_identifier + index}
              item={item}
              isModal={true}
            />
          ))}

          <TouchableOpacity
            onPress={() => { navigation.navigate('ProductDetail', item); closeModal() } }>
            <Text style={styles.actionButton}>Ir a detalle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageProduct: {
    width: screenWidth * 0.4,
    height: 150,
    alignSelf: 'center',
  },
  discount: {
    position: 'absolute',
    left: 45,
    backgroundColor: 'red',
    padding: 5,
    width: 39.5,
    height: 39.5,
    borderRadius: 44 / 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  relatedProductsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    marginHorizontal: 5,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#C6C6C6',
  },
  actionButton: {
    marginTop: 10,
    fontSize: 14,
    backgroundColor: '#C6C6C6',
    padding: 5,
    width: 100,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 5,
  },
});
