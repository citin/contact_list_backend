import { getIdToken, isLoggedIn, csrf } from './AuthService';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

var reload_conf = () => {
    axios.defaults.baseURL = 'http://localhost:8000/';
    axios.defaults.headers.common['Authorization'] = "JWT " + getIdToken();
    axios.defaults.headers.common['X-CSRF-Token'] = csrf();
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}

var postIt = (resource, body) => {
    reload_conf()
    return axios.post(resource, body)
      .catch(error => 
          { 
              toast.error(objToString(error.response.data), {autoClose: false});
           }
      )
}

var getIt = (resource) => {
    reload_conf()
    return axios.get(resource)
      .catch(error => 
          { 
              toast.error(objToString(error.response.data), {autoClose: false});
           }
      )
}

var deleteIt = (resource) => {
    reload_conf()
    return axios.delete(resource)
      .catch(error => 
          { 
              toast.error(objToString(error.response.data), {autoClose: false});
           }
      )
}

var patchIt = (resource, body) => {
    reload_conf()
    return axios.put(resource, body)
      .catch(error => 
          { 
              toast.error(objToString(error.response.data), {autoClose: false});
           }
      )
}

var objToString = (obj) => {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ' :: ' + obj[p] + '\n';
        }
    }
    return str;
}

export {
    deleteIt,
    getIt,
    postIt,
    patchIt,
}
