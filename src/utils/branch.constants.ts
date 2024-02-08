import * as yup from "yup";

export const RENAME_BRANCH_VALIDATION_SCHEMA = yup.object({
  id: yup.string(),
  name: yup.string().required("Name is required"),
});

export const RENAME_BRANCH_DEFAULT_VALUES = {
  id: "",
  name: "",
};

export const CREATE_BRANCH_VALIDATION_SCHEMA = yup.object({
  name: yup.string().required("Name is required"),
  createdFromBranch: yup.string().required("Branch is required"),
});

export const CREATE_BRANCH_DEFAULT_VALUES = {
  name: "",
  createdFromBranchId: ""
};