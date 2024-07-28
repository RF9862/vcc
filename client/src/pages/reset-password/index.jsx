import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";
import axios from "../../config/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwordReset, setPasswordReset] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(8, "Too short!").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        password: values.password,
      });
      toast.success(res.data.message);
      setPasswordReset(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        {passwordReset ? (
          <p className="text-center">Password has been reset successfully.</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                  required
                  errors={errors}
                  touched={touched}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  required
                  errors={errors}
                  touched={touched}
                />
                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded"
                >
                  Reset Password
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
