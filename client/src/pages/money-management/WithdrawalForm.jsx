import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";

export default function WithdrawalForm({ onSubmit }) {
  const WithdrawalFormSchema = Yup.object().shape({
    amount: Yup.number()
      .min(1, "Amount should be greater than 1 USDT.")
      .required("Required"),
    address: Yup.string().required("Required"),
  });

  return (
    <Formik
      initialValues={{ amount: 0, address: "" }}
      validationSchema={WithdrawalFormSchema}
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
          <FormInput
            label="Address"
            name="address"
            type="text"
            required
            errors={errors}
            touched={touched}
          />
          <button
            type="submit"
            className="w-full bg-cyan-400 text-white py-2 rounded font-bold"
          >
            Withdraw
          </button>
        </Form>
      )}
    </Formik>
  );
}
