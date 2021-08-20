import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBoxProps {
  onPress: (filterValue: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({onPress}) => {
  const [search, setSearch] = useState<string>('');

  return (
    <View style={styles.containerStyle}>
      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        value={search}
        placeholder="Buscar Productos"
      />
      <View style={styles.searchIcon}>
        <TouchableOpacity onPress={() => onPress(search)}>
          <Icon name="search-outline" size={30} color="#C1C1C1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // marginHorizontal: 20,
    marginTop: 5,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C6',
  },
  searchIcon: {
    position: 'absolute',
    top: 4,
    right: 0,
    zIndex: 999,
    elevation: 14,
  },
});
