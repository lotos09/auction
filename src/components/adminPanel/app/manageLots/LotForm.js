// import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { useFormik } from 'formik';
// import { Button, TextField } from '@mui/material';
//
// import { useStyles } from './style';
// import { makeCollectionPath, makeRequest } from '../../../../api/general';
// import { Context } from '../../../../App';
// import { useAuthState } from 'react-firebase-hooks/auth';
//
// const styles = {
//   previewContainer: {
//     margin: '20px 0',
//     display: 'flex',
//   },
//   previewCard: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   previewDeleteButton: {
//     marginLeft: 10,
//     width: 200,
//   },
//   previewImg: {
//     border: 'solid 1px black',
//     boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
//     margin: '10px',
//     borderRadius: '5px',
//   },
//   form: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     width: 600,
//   }
// };
//
//
// const LotForm = () => {
//   const [fileUrl, setFileUrl] = useState([]);
//   const [previews, setPreviews] = useState([]);
//
//   const {
//     auth,
//     myBase,
//     isAdmin,
//     isEmployee,
//   } = useContext(Context);
//
//   const isManageAllowed = useMemo(() => isAdmin || isEmployee, [isAdmin, isEmployee]);
//
//   const [user] = useAuthState(auth);
//   const token = user.accessToken;
//
//   const getLots = () => fetch(makeCollectionPath('lots', token, ''))
//     .then(response => response.json())
//     .then(data => setLots(Object.entries(data || [])));
//
//   const onDeleteItem = async (id) => {
//     await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'DELETE');
//     await getLots();
//   };
//
//   const onEditItem = async (id) => {
//     await makeRequest(makeCollectionPath('lots', token, `/${id}`), 'PATCH', {title: 'testTitle'});
//     await getLots();
//   }
//
//   useEffect(() => {
//     fetch(makeCollectionPath('lots', token, ''))
//       .then(response => response.json())
//       .then(data => setLots(Object.entries(data || [])));
//   }, [token]);
//
//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       images: '',
//       description: '',
//     },
//     onSubmit: async (e, { resetForm }) => {
//       await makeRequest(makeCollectionPath('lots', token, ''),
//         'POST', { ...formik.values, images: fileUrl });
//
//       fetch(makeCollectionPath('lots', token, ''))
//         .then(response => response.json())
//         .then(data => setLots(Object.entries(data || [])));
//
//       resetForm();
//       setPreviews([]);
//     },
//   });
//
//   const onFileChange = async e => {
//     formik.handleChange(e);
//     const fileList = Array.from(e.target.files);
//
//     const mappedFiles = fileList.map((file, index) => ({
//       ...file,
//       preview: URL.createObjectURL(file),
//       key: index,
//     }));
//
//     setPreviews(mappedFiles);
//
//     const files = e.target.files;
//     const storageRef = myBase.storage().ref();
//
//     for (let i = 0; i < files.length; i++) {
//       const fileRef = storageRef.child('images').child(files[i].name);
//       await fileRef.put(files[i]);
//       const imageUrl = await fileRef.getDownloadURL();
//       setFileUrl(prev => [...prev, imageUrl]);
//     }
//   };
//   console.log(fileUrl)
//
//   const onDeletePreview = useCallback((key) => {
//     setPreviews(previews.filter(item => item.key !== key));
//   }, [previews]);
//
//   return (
//     <>
//       {isManageAllowed &&
//         <form style={styles.form} onSubmit={formik.handleSubmit}>
//           <input
//             accept='image/*'
//             style={{ display: 'none' }}
//             id='images'
//             multiple
//             name='images'
//             type='file'
//             onChange={onFileChange}
//             value={formik.values.images}
//           />
//           <label htmlFor='images'>
//             <Button variant='contained' component='span'>
//               Upload
//             </Button>
//           </label>
//
//           <TextField
//             required
//             id='title'
//             name='title'
//             label='title'
//             type='text'
//             onChange={formik.handleChange}
//             value={formik.values.title}
//           />
//
//           <TextField
//             required
//             id='desc'
//             label='description'
//             name='description'
//             onChange={formik.handleChange}
//             value={formik.values.description}
//           />
//
//           <Button type='submit'>Submit</Button>
//         </form>}
//
//       <div style={styles.previewContainer}>
//         {previews.map(( file) => {
//           return (<div style={styles.previewCard}>
//               <img style={styles.previewImg} key={file.preview} height='200' src={file.preview} alt="lot image" />
//               <Button onClick={() => onDeletePreview(file.key)} variant='contained' style={styles.previewDeleteButton}>remove</Button>
//             </div>
//           )})}
//       </div>
//     </>
//   );
// };
//
// export default LotForm;
