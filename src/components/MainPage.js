import React, { useContext } from 'react'
import { Context } from '../index'
import { useAuthState } from 'react-firebase-hooks/auth'

const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2NzNkM2M5NDdhZWIxOGI2NGU1OGUzZWRlMzI1NWZiZjU3NTI4NWIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW1hZGV1cyBBbGV4YW5kcnVzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqOWVucFpkd1BFd3FYdXhXSWZaM2tOTzE2RFVDZ3JKQWd2MzByTz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hdWN0aW9uLTE0NTliIiwiYXVkIjoiYXVjdGlvbi0xNDU5YiIsImF1dGhfdGltZSI6MTY1MTAwOTI0MywidXNlcl9pZCI6Ild4SU45YWtHRTloZno4ZDZtcDR5U0Y4dnF5STIiLCJzdWIiOiJXeElOOWFrR0U5aGZ6OGQ2bXA0eVNGOHZxeUkyIiwiaWF0IjoxNjUxMDA5MjQzLCJleHAiOjE2NTEwMTI4NDMsImVtYWlsIjoiZ2V0dXBzdGFuZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMzI0NDcxOTcxNzIxNTg3NzczMCJdLCJlbWFpbCI6WyJnZXR1cHN0YW5kQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.XGaL2e_1uB3LehNSp_WkUiJJghNWyUmjHjgSN8qX1mqTMX8VEm_t4V5rce-Z67F7DxJObCeQ3t38VD-RfO_CqVT_74aOsdPmauX0hGoQqOUrKIzisyluV5XWZqL0yvl7LQDKukO9IRuRDzIrFQUlifdkLzqsspmPsjKEZjfX7i32aVLgoGrv_f2UfL9UKiUX-JHmScY4ZTXoYYkIYiylNXdKUzJHcXingm12lblCXO_8IbPCwD7Jp21gnFQhpOBSwfHDnyfZoa-8qJs6DV19C-c-LMvggGB8DV4wfXMmMhLoPkimT5FkEJFby-F91p1FoW7XE4WMnkMXuO6gWegAuw'
const url = `https://auction-1459b-default-rtdb.europe-west1.firebasedatabase.app/lots/-N-X4mmM5-b_v5pDh1d6.json?auth=${accessToken}`
const getData = () =>
  fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))

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
  })
  return response.json() // parses JSON response into native JavaScript objects
}

const postDataTest = () =>
  makeRequest(url, 'POST', {
    uid: '3b4d05dc-08ee-42c8-857c-23138a93afec',
    token: {
      sub: '3b4d05dc-08ee-42c8-857c-23138a93afec',
      authFields: {
        email: '',
        email_verified: false,
      },
      firebase: {
        sign_in_provider: 'password',
      },
    },
    data: 'asdasd',
  }).then(data => {
    console.log(data)
  })

const putDataTest = () =>
  makeRequest(
    'https://auction-1459b-default-rtdb.europe-west1.firebasedatabase.app/test/-MzZ_pjY_GZGV8l_8-kR.json',
    'PUT',
    { test2: 'putWorks' },
  ).then(data => {
    console.log(data)
  })

const deleteData = () =>
  makeRequest(
    url,
    'DELETE',
  ).then(data => {
    console.log(data)
  })

export const MainPage = () => {

  const { auth } = useContext(Context)
  const [user] = useAuthState(auth)
  console.log(user)

  return (
    <>
      <h2>Test API</h2>
      <button onClick={getData}>getData</button>
      <button onClick={postDataTest}>postData</button>
      <button onClick={putDataTest}>putData</button>
      <button onClick={deleteData}>deleteData</button>
    </>
  )
}
