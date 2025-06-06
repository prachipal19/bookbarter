import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useRouter } from "next/navigation";

interface UpdateBookFormValues {
  ISBN: string;
  img: string;
  title: string;
  author: string;
  inventory: number;
  category: string;
  isExchange: boolean;
}

// Validation Schema for Update Book form
const updateBookValidationSchema = Yup.object().shape({
  img: Yup.string().required("Image URL is required"),
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  inventory: Yup.number(),
  category: Yup.string().required("Category is required"),
  isExchange: Yup.boolean(),
});

const UpdateBook: React.FC<{
  initialValues: UpdateBookFormValues;
  onSubmit: () => void;
  onClose: () => void;
}> = ({ initialValues, onSubmit, onClose }) => {
  const [updateError, setUpdateError] = useState("");
  const router = useRouter();

  const handleSubmit = async (values: UpdateBookFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Payload:", values);

      const response = await fetch(`/api/listings/update?isbn=${values.ISBN}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      onSubmit(); // Refresh listings
    } catch (error) {
      setUpdateError("Error updating book");
      console.error("Update error:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",

        backgroundImage: "url('/images/about.jpg')",
        backgroundRepeat: "no-repeat", // Prevent tiling
        backgroundSize: "cover", // Fit image nicely
        backgroundPosition: "center", // Center the image
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          margin: "20px",
          width: "400px",
          padding: "8px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "24px", marginTop: "8px" }}>Update Book</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={updateBookValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="img"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Image URL
                </label>
                <Field
                  type="text"
                  id="img"
                  name="img"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="img"
                  component="div"
                  className="error-message"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="title"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="author"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Author
                </label>
                <Field
                  type="text"
                  id="author"
                  name="author"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="error-message"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="inventory"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Price
                </label>
                <Field
                  type="number"
                  id="inventory"
                  name="inventory"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="inventory"
                  component="div"
                  className="error-message"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="category"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Category
                </label>
                <Field
                  type="text"
                  id="category"
                  name="category"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="error-message"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="isExchange"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  <Field type="checkbox" id="isExchange" name="isExchange" />
                  &nbsp; Available for Exchange
                </label>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating Book..." : "Update Book"}
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "10px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </Form>
          )}
        </Formik>

        {updateError && (
          <p
            style={{
              marginTop: "20px",
              fontSize: "14px",
              color: "red",
              textAlign: "center",
            }}
          >
            {updateError}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateBook;
