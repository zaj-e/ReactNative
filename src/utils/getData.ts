import {
  categories,
  categoriesData,
  groupCategories,
  groupCategoriesData,
  subCategories,
  subCategoriesData,
} from '../common/contants';

export const getGroupCategories = (): any => {
  return Object.entries(groupCategories).map(
    ([key, value]) => (groupCategoriesData as any)[key],
  );
};

export const getCategories = (groupCategory: string): any => {
  return Object.entries(categories)
    .map(([key, value]) => (categoriesData as any)[key])
    .filter(cat => {
        return cat.parent == groupCategory
    });
};

export const getSubCategories = (category: string): any => {
    return Object.entries(subCategories)
    .map(([key, value]) => (subCategoriesData as any)[key])
    .filter(subCat => {
        return subCat.parent == category
    });
}