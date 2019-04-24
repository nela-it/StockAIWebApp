const serverUrl = 'https://stockzai.com/api/';
const localUrl = 'http://localhost:3001/api/';

// export const fileUpload = 'http://localhost:3001/fileupload';
export const fileUpload = 'https://stockzai.com/fileupload';

export const loginUrl: string = localUrl + 'user/login';
export const registerUrl: string = localUrl + 'user/register';
export const forgotPasswordUrl: string = localUrl + 'user/forgotPassword';
export const resetPasswordUrl: string = localUrl + 'user/changePassword';

// Prediction Group Data
export const predictionGroup: string = localUrl + 'prediction_group/getGroups';
export const getGroupsDetails: string = localUrl + 'prediction_group/exploreGroups';

// Product Data
export const getProductDetails: string = localUrl + 'product/getProductInfo';

// Portfolio 
export const addPortfolio: string = localUrl + 'portfolio/addPortfolio';
export const getPortfolio: string = localUrl + 'portfolio/getPortfolio';

// chart data
export const getChartDataDetails: string = localUrl + 'portfolio/getChartData';

// Stock info 
export const getStockInfo: string = localUrl + 'stocks/getStockInfo';
export const getAlgorithm: string = localUrl + 'algorithm/getAlgorithm';
// User info 
export const getUserInfo: string = localUrl + 'user/userInfo';


export const getAlertNotify: string = localUrl + 'user/getAlertNotify';


export const getSub: string = localUrl + 'payment/payment';
