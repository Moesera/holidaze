import { useState, useEffect, useMemo } from "react";
import { getItem } from "../../localStorage/getItem";

/**
 * GET method for api fetch.
 * @param {string} url endpoint
 * @returns an response from the API, with data, isLoading, isError.
 * @example
 * ```
 * import { useGet } from "path/hooks/service/get";
 *
 *
 * function App() {
 * const { data, isLoading, isError } = useGet(apiUrl);
 *
 * if (isLoading) {
 *   return <div>Loading</div>;
 * }
 *
 * if (isError) {
 *   return <div>Error</div>;
 * }
 *
 * return (
 * <>
 *   <Component Prop={data}
 * </>
 * )
 *
 * }
 * ```
 */
export function useGet(url, offset, limit, auth = false) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const token = getItem("token");
  const API_KEY = import.meta.env.VITE_APP_NOROFF_API_KEY;

  const buildHeader = ({ auth }) => {
    const headers = {};

    if (token) headers.Authorization = `Bearer ${token}`;
    if (auth && API_KEY) headers["X-Noroff-API-Key"] = API_KEY;

    return headers;
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        setIsError(false);
        let dataResults;

        if(offset === undefined) {
          dataResults = await fetch(url, options);
        } else {
          dataResults = await fetch(`${url}?limit=${limit}&offset=${offset}`);
        }

        // check status on response object
        if (!dataResults.ok) {
          throw new Error(`http ${dataResults.statusCode} : ${dataResults.statusText}`);
        }

        // parse response to json
        const json = await dataResults.json();

        // Check for api errors in the json
        if(json.errors && json.errors.length > 0) {
          const errorMessage = json.errors[0].message;
          throw new Error(errorMessage);
        }

        // Check if data is nested
        const innerData = json.data || data;

        setData(innerData);
      } catch (error) {
        console.log(error);
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [url, token, data.errors, offset, limit]);

  if (data) {
    return { data, isLoading, isError };
  }
}
