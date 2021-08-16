import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {View, Text} from 'react-native';
import {loadVisProducts} from '../api/productService';
import {NotLoggedInModal} from '../components/NotLoggedInModal';
import {ScrollList} from '../components/ScrollList';
import {SearchBox} from '../components/SearchBox';
import {AuthContext} from '../context/AuthContext';
import {IProduct} from '../interfaces/product';

interface SearchHistoryScreenProps {}

export const SearchHistoryScreen: React.FC<SearchHistoryScreenProps> = ({}) => {
  const [visProducts, setVisProducts] = useState<IProduct[]>([]);
  const {authState: user, signIn} = useContext(AuthContext);
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] = useState(
    !user.isLoggedIn,
  );

  function loadMore() {}

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
            <SearchBox />
          </View>
          {visProducts.length > 0 ? (
            <View style={{marginVertical: 25}}>
              <ScrollList
                products={visProducts}
                loadMore={loadMore}
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
