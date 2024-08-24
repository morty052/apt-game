import { AvatarObject } from 'components/Avatar';
import { baseUrl } from 'constants/index';
import { getItem } from 'utils/storage';
import { supabase } from 'utils/supabase';

export async function getLeaderBoard(): Promise<any> {
  try {
    const url = `${baseUrl}/user/leaderboard`;

    const response = await fetch(url);
    const { data, error } = await response.json();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const getFriendRequests = async () => {
  const username = getItem('USERNAME') || '';
  try {
    const url = `${baseUrl}/friends/user-friend-requests`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    };

    const response = await fetch(url, options);
    const { friendRequests, error } = await response.json();

    if (error) {
      throw error;
    }

    // * if there are no friend requests, return an empty array
    if (!friendRequests) {
      return {
        friendRequests: [],
        error: null,
      };
    }

    return {
      friendRequests,
      error: null,
    };
  } catch (error) {
    console.log(error, 'occured here');
    return {
      friendRequests: [],
      error,
    };
  }
};

export async function getUserFriends(): Promise<any> {
  try {
    const username = getItem('USERNAME') || '';

    const url = `${baseUrl}/friends/user-friends`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    };

    const response = await fetch(url, options);
    const { friends, friendRequests, error } = await response.json();

    if (error) {
      throw error;
    }

    return {
      friends,
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
  const url = `${baseUrl}/user/search-user`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  };
  try {
    const response = await fetch(url, options);
    const { data, error } = await response.json();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
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
      .ilike('username', `${username}`);

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};

// TODO: STOP USER FROM ADDING THEMSELVES AS A FRIEND
// TODO STOP USERS FROM SENDING MULTIPLE FRIEND REQUESTS
export const sendFriendRequest = async ({ receiverUsername }: { receiverUsername: string }) => {
  const senderUsername = getItem('USERNAME') || '';
  const url = `${baseUrl}/friends/send-friend-request`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ senderUsername, receiverUsername }),
  };
  try {
    const response = await fetch(url, options);
    const { data, error } = await response.json();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
};

export const acceptFriendRequest = async ({ senderUsername }: { senderUsername: string }) => {
  try {
    const receiverUsername = getItem('USERNAME') || '';
    const url = `${baseUrl}/friends/accept-friend-request`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderUsername, receiverUsername }),
    };

    const response = await fetch(url, options);
    const { error, filteredRequests } = await response.json();

    if (error) {
      throw error;
    }

    console.log({ error });

    return { filteredRequests, error: null };
  } catch (error) {
    console.log(error);
    return { error };
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
  } catch (error) {
    console.error(error);
  }
};

export const createPrivateMatch = async ({
  host_id,
  guests,
  username,
  avatar,
}: {
  host_id: string;
  guests: string[];
  username: string;
  avatar: AvatarObject;
}): Promise<any> => {
  const url = `${baseUrl}/user/create-private-match`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ host_id, username, guests, avatar }),
  };
  try {
    const response = await fetch(url, options);
    const { data, error }: any = await response.json();

    if (error) {
      throw error;
    }

    return { data, error };
  } catch (error) {
    console.error(error);
    return { data: null, error };
  }
};

export const getHost = async (room_id: string) => {
  try {
    const { data, error }: any = await supabase
      .from('created_games')
      .select('host(username, avatar(*))')
      .eq('id', room_id);
    if (error) {
      throw new Error(error);
    }
    return data[0];
  } catch (error) {
    console.error(error);
  }
};

const getPlayerStats = async ({ username }: { username: string }) => {
  try {
    const { data, error }: any = await supabase
      .from('users')
      .select('highscore, total_score, level')
      .eq('username', `${username}`);
    if (error) {
      throw error;
    }

    const { highscore, total_score, level } = data[0];
    return { highscore, total_score, level, error };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export const updatePlayerHighScore = async ({
  username,
  scoreForMatch,
}: {
  username: string;
  scoreForMatch: number;
}) => {
  try {
    const {
      highscore,
      total_score,
      level,
      error: playerStatsError,
    } = await getPlayerStats({ username });

    if (playerStatsError) {
      throw playerStatsError;
    }

    const new_total_score = total_score + scoreForMatch;
    const new_highscore = scoreForMatch > highscore;

    if (new_highscore) {
      const { error: updateError }: any = await supabase
        .from('users')
        .update({
          total_score: new_total_score,
          highscore: scoreForMatch,
        })
        .eq('username', `${username}`);
      if (updateError) {
        throw updateError;
      }
    }

    const { error: updateError }: any = await supabase
      .from('users')
      .update({
        total_score: new_total_score,
      })
      .eq('username', `${username}`);
    if (updateError) {
      throw updateError;
    }

    return { error: updateError, new_highscore, new_total_score };
  } catch (error) {
    console.error(error);
    return { updateError: error };
  }
};

const createUserAvatar = async (avatarSelections: AvatarObject) => {
  try {
    const { data, error } = await supabase
      .from('avatars')
      .insert({
        ...avatarSelections,
      })
      .select('id');
    if (error) {
      throw error;
    }

    return data[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const handleSignup = async ({
  username,
  email,
  password,
  expo_push_token,
  avatar,
}: {
  username: string;
  email: string;
  password: string;
  expo_push_token: string;
  avatar: AvatarObject;
}) => {
  console.log('signup', username, email, password, expo_push_token);

  try {
    const AvatarId = await createUserAvatar(avatar);

    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password,
        expo_push_token,
        avatar: AvatarId,
      })
      .select('id');

    if (error) {
      console.log(error);
      throw error;
    }

    return data[0].id;
  } catch (error) {
    console.error(error);
  }
};
