import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {VictoryBar, VictoryChart, VictoryTheme} from 'victory-native';
import {IPriceHistory} from '../interfaces/product';
import {formatNumber} from '../utils/formatter';

const screenWidth = Dimensions.get('screen').width;

interface PriceHistoryProps {
  priceHistory: IPriceHistory[];
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({priceHistory}) => {
  useEffect(() => {
    priceHistory.forEach(ph => {
      ph.priceRender = formatNumber(ph.price);
    });
  }, [priceHistory]);
  return (
    <View style={styles.container}>
      {priceHistory[priceHistory.length - 1].priceRender && (
        <VictoryChart width={screenWidth * 0.9} theme={VictoryTheme.material}>
          <VictoryBar
            domainPadding={{x: 15}}
            style={{data: {fill: '#c43a31'}}}
            alignment="middle"
            data={priceHistory}
            x="fecha"
            y="priceRender"
          />
        </VictoryChart>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
