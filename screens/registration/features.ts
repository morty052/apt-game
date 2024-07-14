import { supabase } from 'utils/supabase';
import { setItem } from 'utils/storage';

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

export const handleSignup = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  console.log('signup', username, email, password);

  const { data, error } = await supabase.from('users').insert({
    username,
    email,
    password,
  });

  if (error) {
    console.log(error);
    return error;
  }

  setItem('USERNAME', username);
  setItem('EMAIL', email);
  setItem('PASSWORD', password);
  setItem('ONBOARDED', 'TRUE');

  return data;
};