// // ApiRequest.js
// import axios from 'axios';

// const ApiRequest = async ({
//   BASEURL,
//   method = 'POST',
//   req,
//   token = null,
//   isForm = false,
// }) => {
//   try {
//     const response = await axios({
//       url: BASEURL,
//       method,
//       headers: {
//         'Content-Type': isForm ? 'multipart/form-data' : 'application/json',
//         ...(token && {Authorization: `Bearer ${token}`}),
//       },
//       data: req, // sending plain JSON body
//     });

//     return {
//       status: response?.status,
//       data: response?.data,
//     };
//   } catch (error) {
//     console.error('API Error:', error?.response?.data || error.message);
//     return {
//       status: error?.response?.status || 500,
//       data: error?.response?.data || {message: error.message},
//     };
//   }
// };

// export default ApiRequest;

// ApiRequest.js
import axios from 'axios';

const ApiRequest = async ({
  BASEURL,
  method = 'POST',
  req,
  token,
  isForm = false,
}) => {
  try {
    // Build headers
    const headers = {
      'Content-Type': isForm ? 'multipart/form-data' : 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios({
      url: BASEURL,
      method,
      headers,
      data: req, // FormData or JSON
    });

    return {
      status: response?.status,
      data: response?.data,
    };
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    return {
      status: error?.response?.status || 500,
      data: error?.response?.data || {message: error.message},
    };
  }
};

export default ApiRequest;
