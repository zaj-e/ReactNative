import database from '@react-native-firebase/database';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
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
import {prefix} from '../common/contants';
import {RelatedProduct} from '../components/RelatedProduct';
import {IProduct} from '../interfaces/product';
import {StackNavigationProps} from '../navigation/StackNavigation';

interface ProductDetailProps
  extends StackScreenProps<StackNavigationProps, 'ProductDetail'> {}

let lastChild: string = '';
let reachedBottom = false;

export const ProductDetail: React.FC<ProductDetailProps> = ({
  navigation,
  route,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  let limit = 5;
  // const [lastChild, setLastChild] = useState<string>('');
  // const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const product = route.params;

  useEffect(() => {
    loadRelatedProducts();
  }, []);

  const loadRelatedProducts = (loadMore?: boolean) => {
    const relatedProductsFetched: IProduct[] = [];
    const categoryGroup =
      product.category.toLocaleLowerCase() === 'tecnología'
        ? 'tecnologia'
        : product.category.toLocaleLowerCase();

    const category = product.sub_category.toLocaleLowerCase();

    const SubSubCategory =
      product.sub_sub_category === 'LED'
        ? 'LED'
        : product.sub_sub_category.toLocaleLowerCase();

    const ref = database().ref(
      `${prefix}products/${categoryGroup}/${category}/${SubSubCategory}`,
    );

    console.log('LOADMORE? ', loadMore);

    if (loadMore) {
      ref
        .orderByChild('pricekey')
        .limitToFirst(limit)
        .startAt(lastChild)
        .on('value', (snapshot: any) => {
          let updates: any = {};
          snapshot.forEach((data: any) => {
          if (snapshot.numChildren() !== limit) {
              reachedBottom = true;
            } 
            lastChild = data.val().product_price + '_' + data.key;
            updates[`/${data.key}/pricekey`] = lastChild;
            relatedProductsFetched.push(data.val());
          });
          console.log('ACTUALIZANDO 2... ', updates);
          ref.update(updates);

          !reachedBottom && relatedProductsFetched.pop();
          setRelatedProducts(oldArray => [
            ...oldArray,
            ...relatedProductsFetched,
          ]);
        });
    } else {
      ref
        .orderByChild('product_price')
        .limitToFirst(limit)
        .on('value', (snapshot: any) => {
          let updates: any = {};
          snapshot.forEach((data: any) => {
            if (snapshot.numChildren() !== limit) {
              reachedBottom = true;
            } 
            lastChild = data.val().product_price + '_' + data.key;
            updates[`/${data.key}/pricekey`] = lastChild;
            relatedProductsFetched.push(data.val());
          });
          console.log('ACTUALIZANDO 1... ', updates);
          ref.update(updates);

          !reachedBottom && relatedProductsFetched.pop();
          setRelatedProducts(oldArray => [
            ...oldArray,
            ...relatedProductsFetched,
          ]);
        });
    }
  };

  const loadMore = () => {
    console.log("Iniciando Load More!")
    if (!reachedBottom) {
      console.log("LOADING MORE")
      loadRelatedProducts(true)
    }
  };

  console.log('Last child RERENDER', lastChild);

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

      {relatedProducts ? (
        <FlatList
          data={relatedProducts}
          renderItem={({item, index}) => <RelatedProduct item={item} />}
          keyExtractor={item => item.id! + item.product_detail}
          ListFooterComponent={() =>  (
            !reachedBottom ? <ActivityIndicator color="red" size={100} /> : null
          )}
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
