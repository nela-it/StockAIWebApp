const serverUrl = 'https://stockzai.com/api/';
const localUrl = 'http://192.168.0.131:3001/api/';
export const loginUrl: string = serverUrl + 'user/login';
export const registerUrl: string = serverUrl + 'user/register';
export const forgotPasswordUrl: string = serverUrl + 'user/forgotPassword';
export const resetPasswordUrl: string = serverUrl + 'user/changePassword';

// Prediction Group Data

export const predictionGroup: string = serverUrl + 'prediction_group/getGroups';
export const getGroupsDetails: string = serverUrl + 'prediction_group/exploreGroups';
