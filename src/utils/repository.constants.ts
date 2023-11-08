import * as yup from "yup";

export const CREATE_REPOSITORY_VALIDATION_SCHEMA = yup.object({
  name: yup.string(),
  description: yup.string(),
  isPrivate: yup.boolean(),
  organizationId: yup.string()
});
