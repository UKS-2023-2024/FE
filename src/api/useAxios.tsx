import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom } from "../store/store";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useAxios = () => {
  const navigate = useNavigate();
  const [token, setToken] = useAtom(tokenAtom);

  const logout = () => {
    setToken(null);
  };

  useEffect(() => {
    const tokenInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.setAuthorization(`Bearer ${token}`);
        }
        return config;
      }
    );

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
  }, [logout, navigate, token]);
  return {
    axios: axiosInstance,
  };
};
