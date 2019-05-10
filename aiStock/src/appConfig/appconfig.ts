const serverUrl = 'https://stockzai.com/api/';
const localUrl = 'http://localhost:3001/api/';

// export const fileUpload = 'http://localhost:3001/api/user/fileUpload';
export const fileUpload = 'https://stockzai.com/api/user/fileUpload';

export const loginUrl: string = serverUrl + 'user/login';
export const registerUrl: string = serverUrl + 'user/register';
export const forgotPasswordUrl: string = serverUrl + 'user/forgotPassword';
export const resetPasswordUrl: string = serverUrl + 'user/changePassword';

// Prediction Group Data
export const predictionGroup: string = serverUrl + 'prediction_group/getGroups';
export const getGroupsDetails: string = serverUrl + 'prediction_group/exploreGroups';

// Product Data
export const getProductDetails: string = serverUrl + 'product/getProductInfo';

// Portfolio 
export const addPortfolio: string = serverUrl + 'portfolio/addPortfolio';
export const getPortfolio: string = serverUrl + 'portfolio/getPortfolio';

// chart data
export const getChartDataDetails: string = serverUrl + 'portfolio/getChartData';

// Stock info 
export const getStockInfo: string = serverUrl + 'stocks/getStockInfo';
export const getAlgorithm: string = serverUrl + 'algorithm/getAlgorithm';
// User info 
export const getUserInfo: string = serverUrl + 'user/userInfo';


export const getAlertNotify: string = serverUrl + 'user/getAlertNotify';


export const getSub: string = serverUrl + 'payment/payment';
