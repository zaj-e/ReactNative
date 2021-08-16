import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import withPreventDoubleClick from '../hoc/withPreventDoubleClick';
import {IProduct} from '../interfaces/product';
import {ConfirmModal} from './ConfirmModal';
import {DetailProductModal} from './DetailProductModal';

interface ProductItemProps {
  item: IProduct;
  productItemStyle?: 'horizontal' | 'vertical';
  hasDeleteButton?: boolean;
  typeFilter?: 'visited' | 'favorite';
}

const screenWidth = Dimensions.get('screen').width;
const ButtonDebounce: any = withPreventDoubleClick(TouchableOpacity);

export const ProductItem: React.FC<ProductItemProps> = ({
  item,
  productItemStyle = 'vertical',
  hasDeleteButton = false,
  typeFilter,
}) => {
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] =
    useState(false);
  const [showDetailProductModal, setShowDetailProductModal] = useState(false);

  const navigation = useNavigation();
  const {changeFavoriteProduct, deleteVisitedProduct} = useContext(AuthContext);

  const deleteProduct = async () => {
    if (typeFilter === 'favorite') {
      await changeFavoriteProduct(item);
    } else {
      await deleteVisitedProduct(item);
    }
  };

  const closeModal = () => {
    setShowConfirmDeletionModal(false);
  };

  const closeDetailProductModal = () => {
    setShowDetailProductModal(false);
  };

  const renderModal = () => {
    return (
      <ConfirmModal
        isVisible={showConfirmDeletionModal}
        backdropOpacity={0.5}
        closeModal={closeModal}
        performAction={deleteProduct}
        titleText="¿Desea eliminar este producto?"
      />
    );
  };

  const preview = () => {
    return (
      <DetailProductModal
        isVisible={showDetailProductModal}
        backdropOpacity={0.5}
        closeModal={closeDetailProductModal}
        item={item}
      />
    );
  };

  return (
    <>
      {preview()}
      {renderModal()}
      <ButtonDebounce
        onPress={() => navigation.navigate('ProductDetail', item)}>
        <View
          style={[
            productItemStyle === 'vertical'
              ? styles.topCardContainer
              : styles.topCardContainerHorizontal,
          ]}>
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
            <TouchableOpacity
              style={styles.preview}
              onPress={() => setShowDetailProductModal(true)}>
              <Icon
                name="search-outline"
                style={{color: 'white', fontWeight: 'bold', fontSize: 25}}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              productItemStyle === 'horizontal' && styles.horizontalText,
            ]}>
            {item.product_name}
          </Text>
          {hasDeleteButton && (
            <TouchableOpacity onPress={() => setShowConfirmDeletionModal(true)}>
              <Icon name="trash-outline" style={styles.trash} size={30} />
            </TouchableOpacity>
          )}
        </View>
      </ButtonDebounce>
    </>
  );
};

const styles = StyleSheet.create({
  topCardContainer: {
    width: screenWidth * 0.4,
    margin: 5,
  },
  topCardContainerHorizontal: {
    display: 'flex',
    flexDirection: 'row',
  },
  horizontalText: {
    width: 150,
    marginLeft: 25,
    marginTop: 25,
  },
  trash: {
    width: 150,
    marginLeft: 25,
    marginTop: 35,
    color: 'red',
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
  preview: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#FFA500',
    padding: 5,
    width: 39.5,
    height: 39.5,
    borderRadius: 44 / 2,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconInfo: {
    width: 150,
    marginLeft: 25,
    marginTop: 35,
    color: 'white',
  },
});
