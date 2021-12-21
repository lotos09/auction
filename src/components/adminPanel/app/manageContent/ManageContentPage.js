import React, { useEffect, useState } from 'react';
import { myBase } from '../../../../firebase/config';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const db = myBase.firestore();

const Input = styled('input')({
  display: 'none',
});

export const ManageContentPage = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [lot, setLot] = useState([]);

  const fetchUsers = async () => {
    const usersCollection = await db.collection('users').get();
    setLot(
      usersCollection.docs.map(doc => {
        return doc.data();
      }),
    );
  };

  const onFileChange = async e => {
    const file = e.target.files[0];
    const storageRef = myBase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const onSubmit = async e => {
    e.preventDefault();
    const username = e.target.username.value;
    const description = e.target.description.value;

    if (!username || !fileUrl) {
      return;
    }
    await db.collection('users').doc(username).set({
      name: username,
      avatar: fileUrl,
      description: description,
    });

    await fetchUsers();
  };

  useEffect(async () => {
    await fetchUsers();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="file" multiple onChange={onFileChange} />

        <TextField
          id="standard-basic"
          label="Name"
          variant="standard"
          type="text"
          name="username"
        />
        <TextField
          id="standard-basic"
          label="Description"
          variant="standard"
          type="text"
          name="description"
        />
        <button>Submit</button>
      </form>
      <div>Gallery</div>
      <div>
        {lot.map(item => {
          return (
            <div key={item.name}>
              <img width="400" src={item.avatar} alt={item.name} />
              <p>name: {item.name}</p>
              <p>description: {item?.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
