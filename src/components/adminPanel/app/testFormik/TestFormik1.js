import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, TextField } from '@mui/material';
import { myBase } from '../../../../firebase/config';

import { useStyles } from '../manageContent/style';
import { lotsUrl } from '../../../../api/auctionLots';
import { makeRequest } from '../../../../api/general';

const db = myBase.firestore();

const TestFormik1 = () => {
  const [fileUrl, setFileUrl] = useState([]);
  const [lots, setLots] = useState([]);
  const [previews, setPreviews] = useState([]);
  const classes = useStyles();
  console.log(lots);

  useEffect(() => {
    fetch(lotsUrl)
      .then(response => response.json())
      .then(data => setLots(Object.values(data)));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      images: '',
      description: '',
    },
    onSubmit: async (e, { resetForm }) => {
      await makeRequest(lotsUrl, 'POST', { ...formik.values, images: fileUrl });

      fetch(lotsUrl)
        .then(response => response.json())
        .then(data => setLots(Object.values(data)));

      resetForm();
      setPreviews([]);
    },
  });

  const form = formik.values;

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

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="images"
          multiple
          name="images"
          type="file"
          onChange={onFileChange}
          value={formik.values.images}
        />
        <label htmlFor="images">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>

        <TextField
          required
          id="title"
          name="title"
          label="title"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.title}
        />

        <TextField
          required
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
        {lots
          .map(item => {
            return (
              <div className={classes.lot} key={item?.title}>
                {item?.images?.map(image => {
                  return <img key={image} src={image} alt={image} />;
                })}
                <p>title: {item?.title}</p>
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
