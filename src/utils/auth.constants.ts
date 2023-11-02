import * as yup from "yup";

export const LOGIN_VALIDATION_SCHEMA = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});


export const LOGIN_DEFAULT_VALUES = {
  email: '',
  password: '',
};