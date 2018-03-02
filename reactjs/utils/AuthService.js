import decode from 'jwt-decode';
import { postIt } from './ApiConnector';

const ID_TOKEN_KEY     = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const CSRF_SELECTOR    = 'meta[name=csrftoken]';

var signin = (username, password, passConfirm, success, error) => {

    if (!username || !password) return false
    if (password !== passConfirm) return false

    let formData  = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('password_confirmation', passConfirm)
    formData.append('csrftoken', csrf())
    formData.append('csrfmiddlewaretoken', csrf())

    return postIt('signin/',
        formData,
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')
        .then((response) => {
            if (success !== undefined) success(response)
        })
        .catch((response) => {
            if (error !== undefined) error(response.response.data)
        })
}
var login = (username, password, success, error) => {

    if (!username || !password) return false

    let formData  = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    return postIt('api-token-auth/',
        formData,
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW')
        .then((response) => {
            localStorage.setItem(ID_TOKEN_KEY, response.data.token);
            if (success !== undefined) success()
        })
        .catch((response) => {
            if (error !== undefined) error(response.response.data)
        })
}

var logout = (cb) => {
    clearIdToken();
    clearAccessToken();
    if (cb !== undefined) cb()
}

window.login = login
var getIdToken = () => localStorage.getItem(ID_TOKEN_KEY);

var getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

var clearIdToken = () => localStorage.removeItem(ID_TOKEN_KEY);

function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
    let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    // return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
function setAccessToken() {
    let accessToken = getParameterByName('access_token');
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
var setIdToken = () => {
    let idToken = getParameterByName('id_token');
    localStorage.setItem(ID_TOKEN_KEY, idToken);
}

var isLoggedIn = ()  => {
    const idToken = getIdToken();
    return !!idToken && !isTokenExpired(idToken);
}

var csrf = () => document.querySelector(CSRF_SELECTOR).content;

var getTokenExpirationDate = (encodedToken) => {
    let token = decode(encodedToken);

    if (!token.exp) return null;

    let date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

var isTokenExpired = (token) =>  getTokenExpirationDate(token) < new Date();
window.csrf = csrf;

export {
    csrf,
    getAccessToken,
    getIdToken,
    isLoggedIn,
    login,
    signin,
    logout,
    setAccessToken,
    setIdToken,
};
