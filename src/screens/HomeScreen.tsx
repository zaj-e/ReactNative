import React from 'react';
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
import {useProducts} from '../hooks/useProducts';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

interface HomeScreenProps {}

export const HomeScreen: React.FC<HomeScreenProps> = ({}) => {
  const {products, isLoading} = useProducts();
  const uri = `https://img.freepik.com/vector-gratis/diseno-cartel-venta-halloween-oferta-70-descuento_1302-24185.jpg`;

  return (
    <ScrollView>
      <View style={{marginHorizontal: 20}}>
        <View>
          <SearchBox />
        </View>
        <View style={styles.imageContainer}>
          <Image source={{uri}} style={styles.posterImage} />
        </View>
        {/* Introduccion  */}
        <View>
          <Text style={styles.mainTextIntro}>Bienvenido a Comparizy</Text>
          <Text style={styles.textIntro}>
            Somos una aplicación que te ayuda a comparar los precios de todos
            los Productos que puedas encontrar en los ecommerce a nivel
            nacional. Te hacemos la vida más fácil ayudándote a ahorrar tiempo y
            esfuerzo en la búsqueda independiente entre todas las tien das
            retail.
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
                source={require('../images/maps.png')}
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

        {!isLoading ? (
          <GridListProduct products={products} />
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
