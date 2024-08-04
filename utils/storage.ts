import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

type retreivableValues =
  | 'LAST_LOGIN'
  | 'LOGIN_COUNT'
  | 'ID'
  | 'USERNAME'
  | 'EMAIL'
  | 'PASSWORD'
  | 'ONBOARDED'
  | 'AVATAR'
  | 'expo_push_token';

export const setItem = (key: string, value: string) => {
  storage.set(key, value);
  console.info('set', key, value);
};

export const getItem = (key: retreivableValues) => {
  return storage.getString(key);
};

export const removeItem = (key: retreivableValues) => {
  storage.delete(key);
  console.info('deleted', key);
};
