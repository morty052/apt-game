import { AvatarObject } from 'components/Avatar';
import { baseUrl } from 'constants/index';
import { getItem } from 'utils/storage';

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
  const url = `${baseUrl}/api/get-players`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerList }),
  };
  try {
    const response = await fetch(url, options);
    const { data, error } = await response.json();

    if (error) {
      throw error;
    }
    console.log({ data });
    return data;
  } catch (error) {
    console.log(error);
    return { error };
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
  const url = `${baseUrl}/api/get-host`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ room_id }),
  };
  try {
    const response = await fetch(url, options);
    const { data, error }: any = await response.json();

    if (error) {
      throw new Error(error);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePlayerHighScore = async ({
  username,
  scoreForMatch,
}: {
  username: string;
  scoreForMatch: number;
}) => {
  const url = `${baseUrl}/user/update-score`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, scoreForMatch }),
  };
  try {
    const response = await fetch(url, options);
    const { new_highscore, new_total_score, error }: any = await response.json();

    return { error, new_highscore, new_total_score };
  } catch (error) {
    console.error(error);
    return { updateError: error };
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
  const url = `${baseUrl}/api/sign-up`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, expo_push_token, avatar }),
  };

  try {
    const response = await fetch(url, options);
    const { data, error } = await response.json();

    if (error) {
      console.log(error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};