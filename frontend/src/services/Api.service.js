import React from 'react';

import axios from 'axios';

const computeConfig = (token) => {
  let headers = { 'content-type': 'application/json' }
  if (token)
    headers = {
      'Authorization': token,
      ...headers
    }

    return {
      api: 'http://localhost:4200/api',
      options: {
        headers: headers
      }
    }
}

/**
 * Send a Http-Post request via axios.
 * @param {*} endpoint The endpoint of the api the request should be send to
 * @param {*} body The body of the post request
 * @returns
 */
const httpPost = async (endpoint, body, authToken) => {
  const config = computeConfig(authToken);
  return axios.post(`${config.api}/${endpoint}`, body, {
      ...config.options
  })
}

const httpPostFile = async (endpoint, body) => {
  const config = computeConfig();
  return axios.post(`${config.api}/${endpoint}`, body, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}

const httpGet = async (endpoint, authToken) => {
  const config = computeConfig(authToken);
  return axios.get(`${config.api}/${endpoint}`, {
    ...config.options
  })
}

const httpDelete = async (endpoint, authToken) => {
  const config = computeConfig(authToken);
  return axios.delete(`${config.api}/${endpoint}`, {
    ...config.options
  })
}

const httpPut = async (endpoint, body, authToken) => {
  const config = computeConfig(authToken);
  return axios.put(`${config.api}/${endpoint}`, body, {
      ...config.options
  })
}

  export default {httpPost, httpPostFile, httpGet, httpDelete, httpPut};