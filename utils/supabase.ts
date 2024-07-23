import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://gepjayxrfvoylhivwhzq.supabase.co';
const anonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcGpheXhyZnZveWxoaXZ3aHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NDM5MDMsImV4cCI6MjAzMTUxOTkwM30.dd-IHKAsG2TXONjU451yHPw6CGtH2u0aflXOX3r9FgA';

export const supabase = createClient(projectUrl, anonKey);

export async function getLeaderBoard() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('highscore', { ascending: false })
      .limit(20);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
