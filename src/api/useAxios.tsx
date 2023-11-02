import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentUserAtom, tokenAtom } from "../store/store";

console.log(import.meta.env.VITE_API_URL);
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useAxios = () => {
  const navigate = useNavigate();
  const [token, setToken] = useAtom(tokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    const logout = () => {
      setToken(null);
      setCurrentUser(null);
    };
    const tokenInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        config.headers.setAuthorization(`Bearer ${token}`);
      }
      return config;
    });

    const unauthorizedInterceptor = axiosInstance.interceptors.response.use(
      function (response: AxiosResponse) {
        return response;
      },
      function (error) {
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(tokenInterceptor);
      axiosInstance.interceptors.response.eject(unauthorizedInterceptor);
    };
  }, [navigate, setCurrentUser, setToken, token]);
  return {
    axios: axiosInstance,
  };
};
