import { useState } from "react";

function useLogin(url) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  async function login(email, password) {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`http ${res.statusCode} : ${res.statusText}`);
      }

      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        // Extract error message from response data
        const errorMessage = data.errors[0].message;
        throw new Error(errorMessage);
      }
  
      const { accessToken, ...user } = data.data || data;
  
      localStorage.setItem("token", JSON.stringify(accessToken));
      localStorage.setItem("user", JSON.stringify(user));

      if(res.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isSuccess, isLoading, isError };
}

export default useLogin;
