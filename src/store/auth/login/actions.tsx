import { gql, useMutation } from "@apollo/client";
import { LoginTypes } from "./actionTypes";

export const loginUser = (user: any, history: any) => {
  return {
    type: LoginTypes.LOGIN_USER,
    payload: { user, history },
  };
};

export const loginSuccess = (user: any) => {
  return {
    type: LoginTypes.LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutUser = (history: any) => {
  return {
    type: LoginTypes.LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = (response: any) => {
  return {
    type: LoginTypes.LOGOUT_USER_SUCCESS,
    payload: response,
  };
};

export const apiError = (error: any) => {
  return {
    type: LoginTypes.API_ERROR,
    payload: error,
  };
};

export const socialLogin = (type: any, history: any) => {

  return {
    type: LoginTypes.SOCIAL_LOGIN,
    payload: { type, history },
  };
};