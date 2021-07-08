import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RelatedProduct} from '../components/RelatedProduct';
import {useRelatedProducts} from '../hooks/useRelatedProducts';
import {useSameModelStores} from '../hooks/useSameModelStores';
import {StackNavigationProps} from '../navigation/StackNavigation';

interface ProductDetailProps
  extends StackScreenProps<StackNavigationProps, 'ProductDetail'> {}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  navigation,
  route,
}) => {
  const product = route.params;
  const {compareProducts} = useSameModelStores(product, 5);
  const {loadRelatedProducts, reachedBottom, relatedProducts} =
    useRelatedProducts(product, 2);

  const loadMore = () => {
    if (!reachedBottom) {
      loadRelatedProducts(true);
    }
  };

  return (
    <View style={{marginHorizontal: 10, flex: 1}}>
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

      {/* {compareProducts ? (
        <FlatList
          data={compareProducts}
          renderItem={({item, index}) => <RelatedProduct item={item} />}
          keyExtractor={item => item.model_store_unique_identifier}
          // ListFooterComponent={() =>  (
          //   !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
          // )}
          // onEndReached={loadMore}
          // onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
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
      )} */}

      {relatedProducts ? (
        <FlatList
          data={relatedProducts}
          renderItem={({item, index}) => <RelatedProduct item={item} />}
          keyExtractor={item => item.model_store_unique_identifier!}
          ListFooterComponent={() =>
            !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={Platform.OS == 'ios' ? 0.1 : 0.00001}
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
