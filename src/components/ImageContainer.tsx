import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageContainerProps {
  data: {
    urlImg: string;
    text: string;
    identifier: string;
  };
  title: number;
  setTitle: any;
  setGroupCategoryTitle: any;
  setCategoryTitle: any;
  groupCategoryTitle: string;
  categoryTitle: string;
}

const screenWidth = Dimensions.get('screen').width;

export const ImageContainer: React.FC<ImageContainerProps> = ({
  data: {text, urlImg, identifier},
  title,
  setTitle,
  setGroupCategoryTitle,
  setCategoryTitle,
  groupCategoryTitle,
  categoryTitle,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (title == 3) {
          navigation.navigate('Comparizy', {
            url: `/products/${groupCategoryTitle.toLocaleLowerCase()}/${categoryTitle.toLocaleLowerCase()}/${text.toLocaleLowerCase()}`,
          });
        } else {
          setTitle((title: number) => title + 1);
          setGroupCategoryTitle((val: any) =>
            title == 1 ? (val = identifier) : val,
          );
          setCategoryTitle((val: any) =>
            title == 2 ? (val = identifier) : val,
          );
        }
      }}>
      <View style={styles.topCardContainer}>
        <Image source={{uri: urlImg}} style={styles.imageProduct} />
        <View style={styles.overLay} />
        <Text style={styles.textFloat}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topCardContainer: {
    width: screenWidth * 0.4,
    margin: 15,
  },
  overLay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.3,
    backgroundColor: 'black',
    width: screenWidth * 0.4,
    height: 150,
    borderRadius: 10,
  },
  imageProduct: {
    width: screenWidth * 0.4,
    height: 150,
    borderRadius: 10,
  },
  textFloat: {
    position: 'absolute',
    bottom: 10,
    left: '25%',
    color: 'white',
    fontWeight: 'bold',
  },
});
