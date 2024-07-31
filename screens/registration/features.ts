import { supabase } from 'utils/supabase';
import { getItem, setItem } from 'utils/storage';

export const checkIfemailExists = async (email: string) => {
  try {
    const { data, error } = await supabase.from('users').select('email').eq('email', email);

    if (error) {
      throw error;
    }

    if (data?.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    return null;
  }
};
