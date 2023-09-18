
import Notify from "../helpers/notify";
export default function useApi() {
  const makeRequest = async (method: string, body = null, endpoint: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
      });
      await checkResponse(response);
      const data = await response.json();
      return data;
    } catch (error: any) {
      Notify.error(error.message);
    }
  };

  async function getResource(endpoint: string) {
    return makeRequest('GET', null, endpoint);
  }

  async function postResource(endpoint: string, payload: any) {
    return makeRequest('POST', payload, endpoint);
  }

  async function putResource(endpoint: string, payload: any) {
    return makeRequest('PUT', payload, endpoint);
  }

  async function deleteResource(endpoint: string) {
    return makeRequest('DELETE', null, endpoint);
  }



  async function checkResponse(response: any) {
    if (await response.ok === false) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || 'Something went wrong';
      throw new Error(errorMessage);
    }
  }

  return {
    getResource, postResource, putResource, deleteResource, checkResponse
  };
}