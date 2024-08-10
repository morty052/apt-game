import { supabase } from 'utils/supabase';

export const checkIfemailExists = async (email: string) => {
  try {
    const { data, error } = await supabase.from('users').select('email').ilike('email', email);

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

export const checkIfUsernameExists = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .ilike('username', username);

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
