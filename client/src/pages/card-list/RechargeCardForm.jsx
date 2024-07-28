import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";

export default function RechargeCardForm({ onSubmit }) {
  const RechargeCardSchema = Yup.object().shape({
    amount: Yup.number()
      .min(10, "Amount should be greater than 10 USD")
      .required("Amount is required"),
  });

  return (
    <Formik
      initialValues={{ amount: "" }}
      validationSchema={RechargeCardSchema}
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
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
            >
              Recharge
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
