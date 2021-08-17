import React from 'react';
import {FlatList} from 'react-native';
import {ImageContainer} from './ImageContainer';

interface GenericGridListProps {
  data: {
    urlImg: string;
    text: string;
    identifier: string;
  }[];
  title: number;
  setTitle: any;
  setGroupCategoryTitle: any;
  setCategoryTitle: any;
}

export const GenericGridList: React.FC<GenericGridListProps> = ({
  data,
  title,
  setTitle,
  setGroupCategoryTitle,
  setCategoryTitle,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <ImageContainer
          data={item}
          title={title}
          setTitle={setTitle}
          setGroupCategoryTitle={setGroupCategoryTitle}
          setCategoryTitle={setCategoryTitle}
        />
      )}
      keyExtractor={item => item.urlImg!}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: 'space-between',
      }}
    />
  );
};
