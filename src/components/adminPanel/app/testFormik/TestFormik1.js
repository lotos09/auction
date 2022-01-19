import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { Button, TextField } from '@mui/material';
import { myBase } from '../../../../firebase/config';

import firebase from 'firebase/compat';
import { useStyles } from '../manageContent/style';

const db = myBase.firestore();

const TestFormik1 = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      avatar: '',
      description: '',
    },
    onSubmit: async e => {
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
    },
  });

  const form = formik.values;

  const classes = useStyles();
  const [fileUrl, setFileUrl] = useState([]);
  const [lot, setLot] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fetchUsers = async () => {
    const usersCollection = await db.collection('users').orderBy('createdAt').get();
    setLot(
      usersCollection.docs.map(doc => {
        return doc.data();
      }),
    );
  };

  const onFileChange = async e => {
    formik.handleChange(e);
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

  useEffect(async () => {
    await fetchUsers();
  }, []);

  console.log(form);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar"
          multiple
          name="avatar"
          type="file"
          onChange={onFileChange}
          value={formik.values.avatar}
        />
        <label htmlFor="avatar">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>

        <TextField
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />

        <TextField
          id="desc"
          label="description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />

        <Button type="submit">Submit</Button>
      </form>

      {previews.map(file => (
        <img key={file.preview} width="200" src={file.preview} />
      ))}
      <div>Gallery</div>
      <div className={classes.gallery}>
        {lot
          .map(item => {
            return (
              <div className={classes.lot} key={item.name}>
                {item.avatar.map(image => {
                  return <img key={image} src={image} alt={image} />;
                })}
                <p>name: {item.name}</p>
                <p>description: {item?.description}</p>
              </div>
            );
          })
          .reverse()}
      </div>
    </>
  );
};

export default TestFormik1;
