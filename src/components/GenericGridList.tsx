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
  groupCategoryTitle: string;
  categoryTitle: string;
}

export const GenericGridList: React.FC<GenericGridListProps> = ({
  data,
  title,
  setTitle,
  setGroupCategoryTitle,
  setCategoryTitle,
  groupCategoryTitle,
  categoryTitle,
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
          groupCategoryTitle={groupCategoryTitle}
          categoryTitle={categoryTitle}
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
