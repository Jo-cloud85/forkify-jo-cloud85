import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";
/*
The goal of this file or of this module is to contain a couple of functions that we 
reuse over and over again in our project.

*/

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData 
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // we are specifying in the request that the data that we're gonna send is going to be in the JSON format.
        },
        body: JSON.stringify(uploadData),
      }) 
    : fetch(url);
  
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) 
      throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch(err) {
    throw err; //the promise that's being returned from getJSON will actually reject.
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) 
      throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch(err) {
    throw err; //the promise that's being returned from getJSON will actually reject.
  }
}

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // we are specifying in the request that the data that we're gonna send is going to be in the JSON format.
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) 
      throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch(err) {
    throw err; 
  }
};
*/