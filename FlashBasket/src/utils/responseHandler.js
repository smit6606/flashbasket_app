export const handleResponse = async (response) => {
  if (response.status === 200 || response.status === 201) {
    return response.data;
  }
  throw new Error(response.data?.message || 'Something went wrong');
};

export const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code other than 2xx
    return error.response.data?.message || 'Server error';
  } else if (error.request) {
    // Request was made but no response was received
    return 'No response from server. Check your network.';
  } else {
    // Something happened in setting up the request
    return error.message;
  }
};
