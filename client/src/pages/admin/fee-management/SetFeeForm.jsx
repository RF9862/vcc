import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import FormInput from "../../../components/FormInput";
import axios from "../../../config/axios";

const SetFeeForm = () => {
  const [initialValues, setInitialValues] = useState({
    newCardFee: "",
    topupFee: "",
  });

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axios.get("/get-fee");
        setInitialValues({
          newCardFee: res.data.newCardFee || "",
          topupFee: res.data.topupFee || "",
        });
      } catch (err) {
        toast.error("Failed to fetch fees");
      }
    };

    fetchFees();
  }, []);

  const FeeSchema = Yup.object().shape({
    newCardFee: Yup.number().required("New card fee is required"),
    topupFee: Yup.number().required("Top-up fee is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post("/admin/set-fee", values);
      toast.success("Fees updated successfully");
    } catch (err) {
      toast.error("Failed to update fees");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={FeeSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="bg-slate-900 p-4 rounded-xl">
          <FormInput
            label="New Card Fee"
            name="newCardFee"
            type="number"
            required
            errors={errors}
            touched={touched}
            labelClassName={"text-white mb-2"}
          />
          <FormInput
            label="Top-up Fee"
            name="topupFee"
            type="number"
            required
            errors={errors}
            touched={touched}
            labelClassName={"text-white mb-2"}
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
            >
              Set Fees
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SetFeeForm;
