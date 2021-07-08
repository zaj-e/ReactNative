import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {HorizontalScrollList} from '../components/HorizontalScrollList';
import {SameProductDiferentStore} from '../components/SameProductDiferentStore';
import {useRelatedProducts} from '../hooks/useRelatedProducts';
import {loadSameModelOtherStores} from '../api/productService';
import {StackNavigationProps} from '../navigation/StackNavigation';
import {IProduct} from '../interfaces/product';

interface ProductDetailProps
  extends StackScreenProps<StackNavigationProps, 'ProductDetail'> {}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  navigation,
  route,
}) => {
  const product = route.params;
  const [compareProducts, setCompareProducts] = useState<IProduct[]>();
  const [isLoading, setIsLoading] = useState(true);
  const {loadRelatedProducts, reachedBottom, relatedProducts} =
    useRelatedProducts(product, 6); // pasar probablemente a servicio

  const loadMore = () => {
    if (!reachedBottom) {
      loadRelatedProducts(true);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let resp = await loadSameModelOtherStores(product);
      setCompareProducts(resp);
      setIsLoading(false);
    })();
  }, [product]);

  return (
    <ScrollView style={{marginHorizontal: 10, flex: 1}}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: product.product_image}}
          style={styles.productImage}
        />
        <Text style={{fontWeight: 'bold'}}>{product.product_name}</Text>
      </View>
      <View
        style={{
          marginTop: 25,
          flexDirection: 'row',
        }}>
        <Image
          source={require('../images/facebookLogo.png')}
          style={styles.iconsStyle}
        />
        <Image
          source={require('../images/whatsappLogo.png')}
          style={styles.iconsStyle}
        />
        <Icon name="heart-outline" size={30} />
        <Icon name="notifications-outline" size={30} />
      </View>

      <Text style={{marginLeft: 5, marginTop: 25, fontWeight: '500'}}>
        Productos relacionados:
      </Text>
      <View style={styles.relatedProductsContainer}>
        <Text style={{flex: 1, fontWeight: 'bold'}}>Tienda</Text>
        <Text style={{flex: 3, fontWeight: 'bold'}}>Producto</Text>
        <Text style={{fontWeight: 'bold'}}>Online</Text>
      </View>

      {!isLoading ? (
        compareProducts!.map(item => (
          <SameProductDiferentStore
            key={item.model_store_unique_identifier}
            item={item}
          />
        ))
      ) : (
        <View
          style={{
            flex: 1,
            height: 80,
            justifyContent: 'center',
            alignContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#C6C6C6',
          }}>
          <ActivityIndicator style={{flex: 1}} color="red" size={100} />
        </View>
      )}

      <View style={{marginTop: 15}}>
        {relatedProducts ? (
          <HorizontalScrollList
            products={relatedProducts}
            loadMore={loadMore}
            reachedBottom={reachedBottom}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <ActivityIndicator color="red" size={100} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  productImage: {
    width: 200,
    height: 200,
  },
  iconsStyle: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  relatedProductsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    marginHorizontal: 5,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#C6C6C6',
  },
});
