import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GenericGridList} from '../components/GenericGridList';
import {
  getCategories,
  getGroupCategories,
  getSubCategories,
} from '../utils/getData';
import withPreventDoubleClick from '../hoc/withPreventDoubleClick';

interface CartegoriesScreenProps {}

const screenWidth = Dimensions.get('screen').width;
const ButtonDebounce: any = withPreventDoubleClick(TouchableOpacity, 100);

export const CartegoriesScreen: React.FC<CartegoriesScreenProps> = ({}) => {
  const [items, setItems] = useState(getGroupCategories());
  const [groupCategoryTitle, setGroupCategoryTitle] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [title, setTitle] = useState(1);

  const heading = () => {
    switch (title) {
      case 1:
        return 'Grupo de categorías';
      case 2:
        return 'Categorías';
      case 3:
        return 'Sub categorías';
    }
  };

  const manageDisplay = () => {
    console.log('TITLE', title);
    switch (title) {
      case 1:
        setItems(getGroupCategories());
        break;
      case 2:
        setItems(getCategories(groupCategoryTitle));
        break;
      case 3:
        setItems(getSubCategories(categoryTitle));
        break;
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTitle(1);
    }, []),
  );

  useEffect(() => {
    manageDisplay();
  }, [title]);

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {title > 1 && (
          <ButtonDebounce
            onPress={() => {
              setTitle((title: number) => (title -= 1));
            }}>
            <Icon
              name="arrow-back-outline"
              style={{
                color: 'black',
                marginTop: 15,
                marginLeft: 15,
              }}
              size={30}
            />
          </ButtonDebounce>
        )}
        <Text
          style={[
            styles.header,
            {marginLeft: title > 1 ? screenWidth / 3.5 : screenWidth / 3},
          ]}>
          {heading()}
        </Text>
      </View>

      <GenericGridList
        data={items}
        title={title}
        setTitle={setTitle}
        setGroupCategoryTitle={setGroupCategoryTitle}
        setCategoryTitle={setCategoryTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
});
