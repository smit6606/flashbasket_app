const responseHandler = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};

const errorHandler = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.message || 'Something went wrong';
  }
  return error.message || 'Network Error';
};

export { responseHandler, errorHandler };
