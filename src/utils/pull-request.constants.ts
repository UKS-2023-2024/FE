import * as yup from "yup";

export const CREATE_PULL_REQUEST_VALIDATION_SCHEMA = yup.object({
  title: yup.string().required(),
  description: yup.string().optional(),
  toBranchId: yup.string().required(),
  fromBranchId: yup.string().required(),
  issueIds: yup.array().of(yup.string().required()).required()
});