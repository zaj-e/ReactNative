import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {Text, View} from 'react-native';
import {loadFavProducts} from '../api/productService';
import {NotLoggedInModal} from '../components/NotLoggedInModal';
import {ScrollList} from '../components/ScrollList';
import {AuthContext} from '../context/AuthContext';
import {IProduct} from '../interfaces/product';

interface FavoritosScreenProps {}

export const FavoritosScreen: React.FC<FavoritosScreenProps> = ({}) => {
  const [favProducts, setFavProducts] = useState<IProduct[]>([]);
  const {authState: user, signIn} = useContext(AuthContext);
  const [showConfirmDeletionModal, setShowConfirmDeletionModal] = useState(
    !user.isLoggedIn,
  );

  function loadMore() {}

  async function loadFavoriteProducts() {
    let resp = await loadFavProducts(user);
    setFavProducts(resp);
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
        bodyText='Necesitas iniciar sesión para activar la opción "Favoritos"'
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoriteProducts();
    }, [user]),
  );

  return (
    <View style={{flex: 1}}>
      {showLoginModal()}
      {user.isLoggedIn ? (
        <View style={{flex: 1}}>
          {favProducts.length > 0 ? (
            <View style={{marginTop: 25}}>
              <ScrollList
                products={favProducts}
                loadMore={loadMore}
                reachedBottom={true}
                productItemStyle="horizontal"
                hasDeleteButton={true}
                typeFilter="favorite"
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
            Debe iniciar sesión para habilitar el Favoritos
          </Text>
        </View>
      )}
    </View>
  );
};
