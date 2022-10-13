import axios from 'axios';
// import TokenService from './token.service';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

// instance.interceptors.request.use(
//   (config) => {
//     // const token = TokenService.getLocalAccessToken();
//     // if (token) {
//     //   config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
//     //   config.headers['x-access-token'] = token; // for Node.js Express back-end
//     // }
//     console.log({ config });
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(
//   (res) => {
//     console.log({ res });
//     return res;
//   },
//   async (err) => {
//     const originalConfig = err.config;
//     console.log({ originalConfig });

//     // if (originalConfig.url !== '/auth/signin' && err.response) {
//     //   // Access Token was expired
//     //   if (err.response.status === 401 && !originalConfig._retry) {
//     //     originalConfig._retry = true;

//     //     try {
//     //       const rs = await instance.post('/auth/refresh', {
//     //         refreshToken: TokenService.getLocalRefreshToken(),
//     //       });

//     //       const { accessToken } = rs.data;
//     //       TokenService.updateLocalAccessToken(accessToken);

//     //       return instance(originalConfig);
//     //     } catch (_error) {
//     //       return Promise.reject(_error);
//     //     }
//     //   }
//     // }

//     return Promise.reject(err);
//   }
// );

export default instance;
