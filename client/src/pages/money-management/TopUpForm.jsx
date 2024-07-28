import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";

export default function TopUpForm({ onSubmit }) {
  const TopUpFormSchema = Yup.object().shape({
    amount: Yup.number()
      .min(1, "Amount should be greater than 1 usd.")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ amount: 100 }}
      validationSchema={TopUpFormSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <FormInput
            label="Amount"
            name="amount"
            type="number"
            required
            errors={errors}
            touched={touched}
          />
          <button
            type="submit"
            className="w-full bg-cyan-400 text-white py-2 rounded font-bold"
          >
            Top Up
          </button>
        </Form>
      )}
    </Formik>
  );
}
