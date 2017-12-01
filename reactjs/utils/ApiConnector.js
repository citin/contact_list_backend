import { getIdToken, isLoggedIn, csrf } from './AuthService';
import axios from 'axios';

var reload_conf = () => {
    axios.defaults.baseURL = 'http://localhost:8000/';
    axios.defaults.headers.common['Authorization'] = "JWT " + getIdToken();
    axios.defaults.headers.common['X-CSRF-Token'] = csrf();
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}

var postIt = (resource, body) => {
    reload_conf()
    return axios.post(resource, body)
}

var getIt = (resource) => {
    reload_conf()
    return axios.get(resource)
}

var deleteIt = (resource) => {
    reload_conf()
    return axios.delete(resource)
}

var patchIt = (resource, body) => {
    reload_conf()
    return axios.put(resource, body)
}

export {
    deleteIt,
    getIt,
    postIt,
    patchIt,
}
