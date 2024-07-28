import { Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";
import axios from "../../config/axios";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post("/auth/request-password-reset", values);
      toast.success(res.data.message);
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        {emailSent ? (
          <p className="text-center">
            Password reset link has been sent to your email.
          </p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  errors={errors}
                  touched={touched}
                />
                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded"
                >
                  Send Reset Link
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
