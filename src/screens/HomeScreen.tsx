import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {GridListProduct} from '../components/GridListProduct';
import {SearchBox} from '../components/SearchBox';
import {useFilteredProducts} from '../hooks/useFilteredProducts';
import {useFilteredProductsByCategory} from '../hooks/useFilteredProductsByCategory';
import {useProducts} from '../hooks/useProducts';
import {StackNavigationProps} from '../navigation/StackNavigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

interface ComparizyProps
  extends StackScreenProps<StackNavigationProps['Comparizy'], 'Comparizy'> {}

export const Comparizy: React.FC<ComparizyProps> = ({route}) => {
  let url: string | undefined;
  url = route.params ? route.params.url : undefined;
  const {products, setProducts, getProducts} = useProducts();
  const [filterValue, setFilteredValue] = useState('');
  const {
    loadFilteredProducts,
    setReachedBottom,
    reachedBottom,
    filteredProducts,
    setFilteredProducts,
  } = useFilteredProducts(5);
  const {
    loadFilteredProductsByCategory,
    setReachedBottomCategory,
    reachedBottomCategory,
    filteredProductsCategory,
    setFilteredProductsCategory,
  } = useFilteredProductsByCategory(5);
  const uri = `https://img.freepik.com/vector-gratis/diseno-cartel-venta-halloween-oferta-70-descuento_1302-24185.jpg`;

  const loadMore = async () => {
    if (!reachedBottom && filterValue && filteredProducts.length > 0) {
      await loadFilteredProducts(filterValue, true);
    }
  };

  const filteProducts = async (filterValue: string) => {
    ``;
    setReachedBottom(false);
    setFilteredProducts([]);
    setProducts([]);
    await loadFilteredProducts(filterValue, false);
    setFilteredValue(filterValue);
  };

  useEffect(() => {
    setReachedBottom(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params.url !== undefined) {
        (async () => {
          setFilteredProductsCategory([]);
          setProducts([]);
          await loadFilteredProductsByCategory('', url!, false);
        })();
      } else {
        (async () => {
          setProducts([]);
          await getProducts();
        })();
      }
    }, [url]),
  );

  useEffect(() => {
    if (filteredProducts.length > 0) setProducts(filteredProducts);
    if (filteredProductsCategory.length > 0)
      setProducts(filteredProductsCategory);
  }, [filteredProducts, filteredProductsCategory]);

  return (
    <ScrollView>
      <View style={{marginHorizontal: 20}}>
        <View>
          <SearchBox onPress={filteProducts} />
        </View>
        {url == undefined && (
          <View>
            <View style={styles.imageContainer}>
              <Image source={{uri}} style={styles.posterImage} />
            </View>
            {/* Introduccion  */}
            <View>
              <Text style={styles.mainTextIntro}>Bienvenido a Comparizy</Text>
              <Text style={styles.textIntro}>
                Somos una aplicación que te ayuda a comparar los precios de
                todos los Productos que puedas encontrar en los ecommerce a
                nivel nacional. Te hacemos la vida más fácil ayudándote a
                ahorrar tiempo y esfuerzo en la búsqueda independiente entre
                todas las tien das retail.
              </Text>
            </View>
            {/* Caracteristicas  */}
            <View>
              <Text
                style={[
                  {
                    ...styles.mainTextIntro,
                    fontSize: 14,
                    marginBottom: 30,
                  },
                ]}>
                Aquí econtrarás
              </Text>
              <View style={styles.horizontalList}>
                <View style={styles.horizontalDisplayContainer}>
                  <Image
                    style={styles.horizontalDisplay}
                    source={require('../images/best-price.gif')}
                  />
                  <Text style={{alignSelf: 'center'}}>
                    Mejor precio competitivo
                  </Text>
                </View>

                <View style={styles.horizontalDisplayContainer}>
                  <Image
                    style={styles.horizontalDisplay}
                    source={require('../images/historial.jpeg')}
                  />
                  <Text style={{alignSelf: 'center'}}>Historial de precio</Text>
                </View>
                <View style={styles.horizontalDisplayContainer}>
                  <Image
                    style={styles.horizontalDisplay}
                    source={require('../images/technology.jpeg')}
                  />
                  <Text style={{alignSelf: 'center'}}>
                    Variedad de productos tecnológicos y electrónicos
                  </Text>
                </View>
              </View>
            </View>
            {/* Tiendas  */}
            <View>
              <Text
                style={[
                  {
                    ...styles.mainTextIntro,
                    fontSize: 14,
                    marginTop: 80,
                    marginBottom: 30,
                  },
                ]}>
                Tiendas principales
              </Text>
              <View style={styles.horizontalList}>
                <Image
                  style={styles.horizontalDisplayStore}
                  source={require('../images/ripleyLogo.png')}
                />
                <Image
                  style={styles.horizontalDisplayStore}
                  source={require('../images/falabellaLogo.png')}
                />
                <Image
                  style={styles.horizontalDisplayStore}
                  source={require('../images/OechsleLogo.jpeg')}
                />
              </View>
            </View>
            <View>
              <Text
                style={[
                  {
                    ...styles.mainTextIntro,
                    fontSize: 14,
                    marginTop: 50,
                    marginBottom: 30,
                    alignSelf: 'flex-start',
                  },
                ]}>
                Productos de locura
              </Text>
            </View>
          </View>
        )}

        {products && products.length > 0 ? (
          <View style={{marginTop: url ? 20 : 0}}>
            <GridListProduct
              products={products}
              loadMore={loadMore}
              reachedBottom={reachedBottom || filterValue == ''}
            />
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            <ActivityIndicator color="red" size={100} />
          </View>
        )}
      </View>
    </ScrollView>
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
});
