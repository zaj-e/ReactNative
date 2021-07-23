export const formatNumber = (num: string) => {
  let numFormat = num.substring(0, num.length - 3);
  numFormat = num.replace(',', '');
  return +numFormat;
};
