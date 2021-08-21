import { useFocusEffect } from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBoxHistoryProps {
  onPress: (filterValue: string) => void;
}

export const SearchBoxHistory: React.FC<SearchBoxHistoryProps> = ({onPress}) => {
  const [search, setSearch] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      setSearch('')
    }, []),
  );

  return (
    <View style={styles.containerStyle}>
      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        value={search}
        placeholder="Buscar Productos visitados"
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
