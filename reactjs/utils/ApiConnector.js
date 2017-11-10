import { getIdToken, isLoggedIn } from './AuthService';

export function postIt(resource, body) {

  var options = {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': "JWT " + getIdToken(),
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'undefined',
      'Accept': 'application/json',                  
    },
    body: body
  }
  return fetch('http://localhost:8000/' + resource , options)
    .then((response) => {
      return response.json()
    })
}

export function getIt(resource) {

    var options = {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'undefined',
        'Accept': 'application/json',                  
        'Authorization': "JWT " + getIdToken(),
      },
    }

   return fetch('http://localhost:8000/' + resource, options)
      .then((response) => {
        return response.json()
      })
}
