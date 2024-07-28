import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import FormInput from "./FormInput";

export default function ChangePasswordForm({ onCancel, onSubmit }) {
  const initialValues = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };

  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Required"),
    password: Yup.string().min(8, "Too Short!").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ChangePasswordSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <FormInput
            label="Old Password"
            name="oldPassword"
            type="password"
            required
            errors={errors}
            touched={touched}
          />
          <FormInput
            label="New Password"
            name="password"
            type="password"
            required
            errors={errors}
            touched={touched}
          />
          <FormInput
            label="Confirm the new password"
            name="confirmPassword"
            type="password"
            required
            errors={errors}
            touched={touched}
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 py-2 px-4 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
