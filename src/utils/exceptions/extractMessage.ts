import axios from 'axios';

export const extractErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `${error.response?.status}: ${error.response?.data.message}`;
    } else if (error.request) {
      return 'Error while making request to API';
    } else {
      return 'Unknown API error';
    }
  } else if (error.message) {
    return error.message as string;
  }
  return 'Unknown error occurred';
};
