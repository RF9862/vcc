import clsx from "clsx";
import { Field } from "formik";

export default function FormInput({
  label,
  name,
  type,
  required,
  errors,
  touched,
  labelClassName,
  options,
}) {
  return (
    <div className="mb-4">
      <label
        className={clsx("block text-sm font-semibold mb-1", labelClassName)}
      >
        {required && <span className="text-red-500">*</span>} {label}
      </label>
      {type === "select" ? (
        <Field
          as="select"
          name={name}
          className={`w-full px-3 py-2 border rounded ${
            errors[name] && touched[name] ? "border-red-500" : ""
          }`}
        >
          <option value="">Select a card</option>
          {options.map((option) => (
            <option key={option.bin} value={option.bin}>
              {option.type} - {option.bin}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          type={type}
          name={name}
          className={`w-full px-3 py-2 border rounded ${
            errors[name] && touched[name] ? "border-red-500" : ""
          }`}
        />
      )}
      {errors[name] && touched[name] ? (
        <div className="text-red-500 text-xs mt-1">{errors[name]}</div>
      ) : null}
    </div>
  );
}
