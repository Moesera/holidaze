import { useState } from "react";
import { getItem } from "../../localStorage/getItem";

/**
 * Sends a request to the endpoint, by providing the url.
 * @param {string} url contains the endpoint you want to reach.
 * @returns data, isSuccess, isLoading, isError
 * @example
 * ```
 * const { id } = useParams();
 * const { apiData, isSuccess, isLoading, isError, } = useApi(venues + id);
 * ```
 */
export function useApi(url) {
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const token = getItem("token");

/**
 * Sends an api request to the endpoint.
 * @param {Object} body contains the values you want to send to the api in the body.
 * @param {String} method contains the method to send to the api.
 * @returns data results or error from the api endpoint.
 * @example
 * ```
 * function onSubmit(){
 *  const method = "POST" 
 *  const body = {
 *   title: "MyTile",
 *   body: "Some provided text",
 *  }
 * 
 * apiData(body, method);
 * }
 * ```
 */
  async function apiData(body, method) {
    const options = {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      let dataResults;

      dataResults = await fetch(url, options);

      if (!dataResults.ok) {
        // Handle bad HTTP response
        const data = await dataResults.json();
        if (data.errors && data.errors.length > 0) {
          // Extract error message from response data
          const errorMessage = data.errors[0].message;
          throw new Error(errorMessage);
        } else {
          throw new Error(`Request failed with status code ${dataResults.status}`);
        }
      }

      const json = await dataResults.json();

      setData(json);

      if (dataResults.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error.errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (data) {
    return { apiData, isSuccess, isLoading, isError };
  }
}
