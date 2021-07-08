import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { IProduct } from '../interfaces/product';
import { ProductDetail } from '../screens/ProductDetail';

export type StackNavigationProps = {
    HomeScreen: undefined;
    ProductDetail: IProduct;
}

const Stack = createStackNavigator();

export const StackNavigation: React.FC<StackNavigationProps> = ({}) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerTitleStyle: {
                        color: 'orange',
                        fontWeight: 'bold'
                    },
                    cardStyle: {
                        backgroundColor: 'white'
                    }
                }}
            >
                <Stack.Screen name="Comparizy" component={HomeScreen} />
                <Stack.Screen name="ProductDetail" component={ProductDetail} />
            </Stack.Navigator>
        )
}