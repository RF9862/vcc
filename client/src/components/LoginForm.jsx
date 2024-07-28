import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

import FormInput from "./FormInput";

export default function LoginForm({ onSubmit }) {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <FormInput
            label="Email"
            name="email"
            type="text"
            required
            errors={errors}
            touched={touched}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            errors={errors}
            touched={touched}
          />
          <button
            type="submit"
            className="w-full bg-cyan-400 text-white py-2 rounded font-bold"
          >
            Log In
          </button>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-cyan-400 font-bold text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
