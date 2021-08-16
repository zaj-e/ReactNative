import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {CartegoriesScreen} from '../screens/CartegoriesScreen';
import {FavoritosScreen} from '../screens/FavoritosScreen';
import {SearchHistoryScreen} from '../screens/SearchHistoryScreen';
import {colores} from '../theme/appTheme';
import {StackNavigation} from './StackNavigation';

// export const Tabs = () => {
//   return Platform.OS === 'ios' ? <TabsIOS /> : <TabsAndroid />;
// };

const BottomTab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <BottomTab.Navigator
      sceneContainerStyle={{
        backgroundColor: 'white',
      }}
      tabBarOptions={{
        activeTintColor: colores.primary,
        style: {
          borderTopColor: colores.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        labelStyle: {
          fontSize: 15,
        },
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}) => {
          // customize each tab icon
          let iconName: string = '';
          switch (route.name) {
            case 'HomeScreen':
              iconName = 'home-outline';
              break;
            case 'CategoriesScreen':
              iconName = 'pricetag-outline';
              break;
            case 'SearchHistoryScreen':
              iconName = 'newspaper-outline';
              break;
            case 'FavoritosScreen':
              iconName = 'heart-outline';
              break;
          }

          return <Icon name={iconName} size={20} color={color} />;
        },
      })}>
      <BottomTab.Screen
        name="HomeScreen"
        options={{title: 'Principal'}}
        component={StackNavigation}
        listeners={({navigation}) => ({
          tabPress: () => {
            navigation.navigate('Comparizy');
          },
        })}
      />
      <BottomTab.Screen
        name="CategoriesScreen"
        options={{title: 'Categorías'}}
        component={CartegoriesScreen}
      />
      <BottomTab.Screen
        name="SearchHistoryScreen"
        options={{title: 'Historia de búsqueda'}}
        component={SearchHistoryScreen}
      />
      <BottomTab.Screen
        name="FavoritosScreen"
        options={{title: 'Favoritos'}}
        component={FavoritosScreen}
      />
    </BottomTab.Navigator>
  );
};
