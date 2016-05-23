require('script!./dependencies/sails.io.js');

import {push} from 'react-router-redux'

export function server(store, method, url, data, callback) {
  var token = store.auth.token;
  io.socket.request({
    method: method,
    url: url,
    data: data,
    headers: {
      'Authorization': 'JWT ' + token
    }
  }, function (resData, jwres ) {
    console.log("returned", resData)
    // redirect to the login if invalid cookie
    if (jwres.statusCode == 401) {
        store.dispatch(push("/login"))
        return;
    }
    callback(resData, jwres)
  })

}
