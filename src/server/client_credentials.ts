import axios from 'axios';
import qs from 'qs';

import dotenv from 'dotenv';
dotenv.config();

export const getAuth = async () => {
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;
  
  const url = 'https://accounts.spotify.com/api/token';
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: 'client_credentials',
  };

  try {
    const response = await axios.post(url, qs.stringify(data), config);
    return response.data.access_token;
  } catch (err) {
    console.log(err);
  }
};


const getTrack = async () => {
  const accessToken = await getAuth();
  
  const url = 'https://api.spotify.com/v1/search?q=going+to+california&type=track&limit=1';
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  };
  
  try {
    const response = await axios.get(url, config)
    return response.data.tracks.items;
  } catch (err) {
    console.log(err);
  }

};

getTrack().then(output => console.log(output));