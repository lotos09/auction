import React from 'react';

const url = 'https://auction-1459b-default-rtdb.europe-west1.firebasedatabase.app/lots.json';

const getData = () =>
  fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));

// Example POST method implementation:
async function makeRequest(url = '', method, data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const postDataTest = () =>
  makeRequest(url, 'POST', { title: 'third lot', description: 'more text here' }).then(data => {
    console.log(data);
  });

const putDataTest = () =>
  makeRequest(
    'https://auction-1459b-default-rtdb.europe-west1.firebasedatabase.app/test/-MzZ_pjY_GZGV8l_8-kR.json',
    'PUT',
    { test2: 'putWorks' },
  ).then(data => {
    console.log(data);
  });

export const MainPage = () => {
  return (
    <>
      <button onClick={getData}>getData</button>
      <button onClick={postDataTest}>postData</button>
      <button onClick={putDataTest}>putData</button>
    </>
  );
};
