import nameData from './randomPlayerNames.json';

export const getRandomName = (appearance: 'boyish' | 'girlish'): string => {
  const nameList =
    appearance === 'boyish' ? nameData.boyishNames : nameData.girlishNames;
  const randomIndex = Math.floor(Math.random() * nameList.length);
  return nameList[randomIndex];
};
