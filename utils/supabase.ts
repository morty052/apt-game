import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://gepjayxrfvoylhivwhzq.supabase.co';
const anonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcGpheXhyZnZveWxoaXZ3aHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NDM5MDMsImV4cCI6MjAzMTUxOTkwM30.dd-IHKAsG2TXONjU451yHPw6CGtH2u0aflXOX3r9FgA';

export const supabase = createClient(projectUrl, anonKey);

export async function getLeaderBoard() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, avatar(*)')
      .order('totalscore', { ascending: false })
      .limit(20);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

const getFriendsList = async () => {
  try {
    const { data, error } = await supabase.from('users').select('friends').eq('username', 'adam');

    if (error) {
      throw error;
    }

    return data[0].friends;
  } catch (error) {
    console.log(error);
  }
};

export async function getUserFriends() {
  try {
    const friends = await getFriendsList();
    const { data, error } = await supabase
      .from('users')
      .select('*, avatar(*)')
      .in('username', friends);
    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
