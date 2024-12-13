import axios from 'axios';

const BASE_URL = 'https://assignment.stage.crafto.app'; 

const apiClient = axios.create({
  baseURL: BASE_URL,  
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Add a request interceptor to add token to headers if it's available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const post = async (url, data = {}, params = {}) => {
    try {
        const response = await fetch(`${BASE_URL + url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
};
// Function to handle GET requests
const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url,{
        'Authorization': `${localStorage.getItem('token')}`
      });    
    return response.data;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error; 
  }
};

// Function to handle POST requests
const loginService = async (url, data = {}, params = {}) => {
  try {
    const response = await apiClient.post(url, data, { params });
    console.log(response);
    localStorage.setItem('token',response?.data?.token)
    return response.data; 
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};

const uploadImage = async (imageFile) =>{

    const formData = new FormData();
    formData.append('file', imageFile);
  
    const response = await fetch(`https://crafto.app/crafto/v1.0/media/assignment/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add any headers if needed (e.g., Authorization)
        'Authorization': `${localStorage.getItem('token')}`
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
  
    const data = await response.json();
    return data;  // Return the uploaded media URL
  };
// Export the service functions
export const sharedService = {
  get,
  post,
  uploadImage,
  loginService
};
