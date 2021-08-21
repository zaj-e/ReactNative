import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {Text, View} from 'react-native';
import Slider from 'rn-range-slider';
import {loadVisProducts} from '../api/productService';
import {NotLoggedInModal} from '../components/NotLoggedInModal';
import {ScrollList} from '../components/ScrollList';
import {SearchBox} from '../components/SearchBox';
import Label from '../components/Slider/Label';
import Notch from '../components/Slider/Notch';
import Rail from '../components/Slider/Rail';
import RailSelected from '../components/Slider/RailSelected';
import silderStyles from '../components/Slider/silderStyles';
import Thumb from '../components/Slider/Thumb';
import {AuthContext} from '../context/AuthContext';
import {IProduct} from '../interfaces/product';

interface SearchHistoryScreenProps {}

export const SearchHistoryScreen: React.FC<SearchHistoryScreenProps> = ({}) => {
  const [visProducts, setVisProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const {authState: user, signIn} = useContext(AuthContext);
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] = useState(
    !user.isLoggedIn,
  );

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(20000);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  async function loadVisitedProducts() {
    let resp = await loadVisProducts(user);
    setVisProducts(resp);
  }

  const closeModal = () => {
    setShowConfirmDeletionModal(false);
  };

  const showLoginModal = () => {
    return (
      <NotLoggedInModal
        isVisible={showConfirmDeletionModal}
        backdropOpacity={0.5}
        closeModal={closeModal}
        performAction={() => signIn(closeModal)}
        titleText="No has iniciado sesión"
        bodyText='Necesitas iniciar sesión para activar la opción "Historial de búsqueda"'
      />
    );
  };

  const filterVisProducts = (filteredValue: string) => {
    setFilteredProducts(
      visProducts.filter(prod => {
        const priceFloat = parseFloat(prod.product_price.replace(/,/g, ''));
        if (priceFloat >= low && priceFloat <= high) {
          if (
            prod.brand.includes(filteredValue) ||
            prod.product_name.includes(filteredValue) ||
            prod.sub_category.includes(filteredValue)
          )
          return true;
          else return false;
        }
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadVisitedProducts();
    }, [user]),
  );

  return (
    <View style={{flex: 1}}>
      {showLoginModal()}
      {user.isLoggedIn ? (
        <View style={{flex: 1}}>
          <View style={{marginHorizontal: 25}}>
            <SearchBox onPress={filterVisProducts} />
            <Text style={{marginTop: 20}}>
              Busque por nombre, precio, marca o categoría
            </Text>
            <Text style={{marginTop: 20}}>
              Filtrar por precio: S/. {low} - S/. {high}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Slider
                style={[
                  silderStyles,
                  {marginTop: 20, marginBottom: 20, width: '80%'},
                ]}
                min={0}
                max={20000}
                step={1}
                floatingLabel
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={handleValueChange}
              />
            </View>
          </View>
          {visProducts.length > 0 ? (
            <View style={{marginVertical: 25}}>
              <ScrollList
                products={
                  filteredProducts.length > 0 ? filteredProducts : visProducts
                }
                loadMore={() => {}}
                reachedBottom={true}
                productItemStyle="horizontal"
                hasDeleteButton={true}
                typeFilter="visited"
              />
            </View>
          ) : (
            <View style={{alignItems: 'center', marginTop: 25}}>
              <Text>No se encontraron productos</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={{alignItems: 'center', marginTop: 25}}>
          <Text>
            Debe iniciar sesión para habilitar el Historial de búsqueda
          </Text>
        </View>
      )}
    </View>
  );
};
