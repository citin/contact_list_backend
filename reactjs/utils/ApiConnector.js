import { getIdToken, isLoggedIn, csrf } from './AuthService';
import axios from 'axios';

function reload_conf() 
{
axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.common['Authorization'] = "JWT " + getIdToken();
axios.defaults.headers.common['X-CSRF-Token'] = csrf();
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}
export function postIt(resource, body, contentType) {
  reload_conf();
  return axios.post(resource, body)
}

export function getIt(resource) {
  reload_conf();
  return axios.get(resource)
}

export function deleteIt(resource) {
  reload_conf();
  return axios.delete(resource)
}
