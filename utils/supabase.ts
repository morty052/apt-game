import { createClient } from '@supabase/supabase-js';
import { inviteProps } from 'types';

const projectUrl = 'https://gepjayxrfvoylhivwhzq.supabase.co';
const anonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcGpheXhyZnZveWxoaXZ3aHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NDM5MDMsImV4cCI6MjAzMTUxOTkwM30.dd-IHKAsG2TXONjU451yHPw6CGtH2u0aflXOX3r9FgA';

export const supabase = createClient(projectUrl, anonKey);

const apiUrl = 'https://exp.host/--/api/v2/push/send';

const sendNotification = async ({
  to,
  title,
  body,
}: {
  to: string;
  title: string;
  body: string;
}) => {
  const payload = {
    to,
    title,
    body,
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('Push notification sent successfully:', data);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

const broadcast = async ({
  list,
  title,
  body,
}: {
  list: string[];
  title: string;
  body: string;
}) => {
  try {
    const { data: playersToNotify, error } = await supabase
      .from('users')
      .select('expo_push_token')
      .in('username', list);
    if (error) {
      throw error;
    }

    for (const player in playersToNotify) {
      sendNotification({
        to: playersToNotify[player].expo_push_token,
        title: 'New private match',
        body,
      });
    }

    console.log({ playersToNotify });
  } catch (error) {
    console.error(error);
  }
};

export async function getLeaderBoard() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, avatar(*)')
      .order('total_score', { ascending: false })
      .limit(20);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

const getFriendsList = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('friends')
      .eq('username', `${username}`);

    if (error) {
      throw error;
    }

    if (data[0].friends === null) {
      return [];
    }

    return data[0].friends;
  } catch (error) {
    console.log(error);
  }
};

const getFriendRequests = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('friend_requests')
      .eq('username', `${username}`);

    if (error) {
      throw error;
    }

    // * if there are no friend requests, return an empty array
    if (!data[0].friend_requests) {
      return [];
    }

    return data[0].friend_requests;
  } catch (error) {
    console.log(error);
  }
};

// TODO LOOK FOR A WAY TO INCLUDE AVATARS
export const getInvites = async (username: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('created_games')
      .select('host(username, avatar(*)), id, guests')
      .containedBy('guests', [`${username}`]);

    if (error) {
      throw error;
    }

    console.log({ data });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export async function getUserFriends(username: string): Promise<any> {
  try {
    // * get users friends usernames
    const friends = await getFriendsList(username);

    // * get friend requests
    const friendRequests = await getFriendRequests(username);

    // * query player database for all users with those usernames
    const { data, error } = await supabase
      .from('users')
      .select('username, total_score, online, avatar(*)')
      .in('username', friends);
    if (error) {
      throw error;
    }

    console.log({ data });

    return {
      friends: data,
      friendRequests,
    };
  } catch (error) {
    console.error(error);
    return {
      friends: [],
      friendRequests: [],
    };
  }
}

export const getSearchResults = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, avatar(*)')
      .eq('username', `${username}`);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

export const getPlayers = async (playerList: string[]): Promise<any> => {
  try {
    const { data, error }: any = await supabase
      .from('users')
      .select('username, avatar(*)')
      .in('username', playerList);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};

export const getPlayerDetails = async (username: string): Promise<any> => {
  try {
    const { data, error }: any = await supabase
      .from('users')
      .select('*')
      .eq('username', `${username}`);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};

// TODO: STOP USER FROM ADDING THEMSELVES AS A FRIEND
// TODO STOP USERS FROM SENDING MULTIPLE FRIEND REQUESTS
export const sendFriendRequest = async ({
  receiverUsername,
  senderUsername,
}: {
  receiverUsername: string;
  senderUsername: string;
}) => {
  try {
    // * get users existing friend requests
    const friends = await getFriendRequests(receiverUsername);

    // * add sender's username to friend requests
    const updatedFriendRequests = [...friends, senderUsername];

    const { data, error } = await supabase
      .from('users')
      .update({ friend_requests: updatedFriendRequests })
      .eq('username', `${receiverUsername}`)
      .select('*, avatar(*)');

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

export const acceptFriendRequest = async ({
  receiverUsername,
  senderUsername,
}: {
  receiverUsername: string;
  senderUsername: string;
}) => {
  try {
    // * get receivers existing friends
    const friends = await getFriendsList(receiverUsername);

    console.log({ friends });

    // * get senders existing friends
    const sendersFriends = await getFriendsList(senderUsername);

    // * add sender's username to receivers friends list
    const updatedFriends = [...friends, senderUsername];

    // * add receiver's username to senders friends list
    const updatedSendersFriends = [...sendersFriends, receiverUsername];

    // * remove sender's username from receivers friend requests
    const existingRequests = await getFriendRequests(receiverUsername);
    const filteredRequests = existingRequests.filter(
      (request: string) => request !== senderUsername
    );

    // * add sender's username to receivers friends list
    const { data: receiversUpdateData, error: receiversUpdateError } = await supabase
      .from('users')
      .update({ friends: updatedFriends, friend_requests: filteredRequests })
      .eq('username', `${receiverUsername}`)
      .select('friend_requests');

    // * add receiver's username to senders friends list
    const { data: sendersUpdateData, error: sendersUpdateError } = await supabase
      .from('users')
      .update({ friends: updatedSendersFriends })
      .eq('username', `${senderUsername}`)
      .select('*, avatar(*)');

    if (receiversUpdateError || sendersUpdateError) {
      throw receiversUpdateError || sendersUpdateError;
    }

    return { filteredRequests, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: error };
  }
};

const updateGuestsInvites = async ({
  host,
  game_id,
  guests,
}: {
  host: string;
  game_id: string;
  guests: string[];
}) => {
  try {
    const { data, error }: any = await supabase
      .from('users')
      .update({
        game_invites: {
          [game_id]: {
            username: host,
            game_id,
          },
        },
      })
      .in('username', guests)
      .select('id');
    if (error) {
      throw error;
    }

    console.log({ dataInvites: data });
  } catch (error) {
    console.error(error);
  }
};

export const createPrivateMatch = async ({
  host_id,
  guests,
  username,
}: {
  host_id: string;
  guests: string[];
  username: string;
}): Promise<any> => {
  try {
    const { data, error }: any = await supabase
      .from('created_games')
      .insert({ host: host_id, guests })
      .select('id');

    if (error) {
      throw error;
    }

    // * notify guests
    await broadcast({
      list: guests,
      body: `join ${username} in a new private match.`,
      title: `${username} has invited you to a private match.`,
    });

    // * add game to guests invite list

    await updateGuestsInvites({
      host: username,
      game_id: data[0].id,
      guests,
    });

    return { data, error };
  } catch (error) {
    console.error(error);
    return { data: null, error };
  }
};
