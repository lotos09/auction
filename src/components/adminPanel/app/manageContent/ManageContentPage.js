import React, { useEffect, useState } from 'react';
import { myBase } from '../../../../firebase/config';
import Button from '@mui/material/Button';

import { TextField } from '@mui/material';
import firebase from 'firebase/compat';

const db = myBase.firestore();

export const ManageContentPage = () => {
  const [fileUrl, setFileUrl] = useState([]);
  const [lot, setLot] = useState([]);
  const [previews, setPreviews] = useState([]);
  console.log(previews, fileUrl)

  const fetchUsers = async () => {
    const usersCollection = await db.collection('users').orderBy('createdAt').get();
    setLot(
      usersCollection.docs.map(doc => {
        return doc.data();
      }),
    );
  };

  const onFileChange = async e => {
    console.log(e.target.files)
    const fileList = Array.from(e.target.files);

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(mappedFiles);


    const files = e.target.files;
    const storageRef = myBase.storage().ref();

    for (let i = 0; i < files.length; i++) {
      const fileRef = storageRef.child('images').child(files[i].name);
      await fileRef.put(files[i]);
      const imageUrl = await fileRef.getDownloadURL();
      setFileUrl(prev => [...prev, imageUrl]);
    }

  };

  const onSubmit = async e => {
    e.preventDefault();
    setPreviews([]);
    const username = e.target.username.value;
    const description = e.target.description.value;

    if (!username || !fileUrl) {
      return;
    }
    await db.collection('users').doc(username).set({
      name: username,
      avatar: fileUrl,
      description: description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await fetchUsers();
  };

  useEffect(async () => {
    await fetchUsers();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>

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
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
      {previews.map(file => (
        <img key={file.preview} width="200" src={file.preview} />
      ))}
      <div>Gallery</div>
      <div>
        {lot.map(item => {
          return (
            <div key={item.name}>
              {item.avatar.map(image => {
                return (
                  <img key={image} width="400" src={image} alt={image} />
                )
              })}
              <p>name: {item.name}</p>
              <p>description: {item?.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
