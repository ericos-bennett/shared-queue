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
  const { login_result, code } = payload;
  if (login_result) {
    login_result && Cookie.set('accessToken', code);
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
          payload: login_result,
        });
      });
  }
};
const requestLogin = (dispatch, href) => {
  axios.get('/api/auth/code').then(res => {
    window.location.href = res.data;
  });

  // DO you need a LOGIN_LOADING action here? Could the above function exit in the AuthButton file?
  dispatch({
    type: types.LOGIN_LOADING,
    payload: true,
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

export default appActions;
