import { types } from '../reducers/actionTypes';
import Cookie from 'js-cookie';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';

const setLoginStatus = (state, dispatch, payload) => {
  dispatch({
    type: types.LOGIN,
    payload: payload,
  });
};

const updateLoginStatus = (state, dispatch, payload) => {
  const { loginResult, code } = payload;
  if (loginResult) {
    loginResult && Cookie.set('accessToken', code);
    const url = `${SERVER_URL}/api/auth/token/?code=${code}`;
    // ${code}
    axios
      .get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => {
        dispatch({
          type: types.LOGIN,
          payload: loginResult,
        });
      });
  }
};
const requestLogin = (dispatch) => {
  axios.get('/api/auth/code').then(res => {
    window.location.href = res.data;
  });
};

const logout = (dispatch, payload) => {
  Cookie.remove('accessToken');
  dispatch({
    type: types.LOGOUT,
    payload: false,
  });
};

// IMO we should stick to one type of export (named or default)
export const appActions = {
  setLoginStatus,
  updateLoginStatus,
  requestLogin,
  logout,
};
