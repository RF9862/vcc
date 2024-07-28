import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import FormInput from "../../components/FormInput";
import { SupportedCards } from "../../config";

export default function OpenCardForm({ onSubmit }) {
  const OpenCardSchema = Yup.object().shape({
    cardBin: Yup.string().required("Card Bin is required"),
    amount: Yup.number()
      .min(1, "Amount should be greater than 1 USD")
      .required("Amount is required"),
    remark: Yup.string(),
  });

  return (
    <Formik
      initialValues={{ cardBin: "", amount: "", remark: "" }}
      validationSchema={OpenCardSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <FormInput
            label="Card Bin"
            name="cardBin"
            type="select"
            required
            errors={errors}
            touched={touched}
            options={SupportedCards}
          />
          <FormInput
            label="Amount"
            name="amount"
            type="number"
            required
            errors={errors}
            touched={touched}
          />
          <FormInput
            label="Remark"
            name="remark"
            type="text"
            errors={errors}
            touched={touched}
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
            >
              Activate
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
