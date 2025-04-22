import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useRouter } from "next/navigation";

// Define interface for form values
interface AddBookFormValues {
  ISBN: string;
  img: string;
  title: string;
  author: string;
  category: string;
  price: number;
  isExchange: boolean;
}

// Validation Schema for Add Book form
const addBookValidationSchema = Yup.object().shape({
  ISBN: Yup.string().required("ISBN is required"),
  img: Yup.string().required("Image URL is required"),
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .integer("Price must be an integer"),
  isExchange: Yup.boolean(),
});

const AddBook: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();

  const handleSubmit = async (values: AddBookFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Payload:", values);

      const response = await fetch("/api/listings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to add listing: ${response.statusText}`);
      }

      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding book:", error);
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
        <h1 style={{ fontSize: "24px", marginTop: "8px" }}>Add Book</h1>

        <Formik
          initialValues={{
            ISBN: "",
            img: "",
            title: "",
            author: "",
            category: "",
            price: 0,
            isExchange: false,
          }}
          validationSchema={addBookValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="ISBN"
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  ISBN
                </label>
                <Field
                  type="text"
                  id="ISBN"
                  name="ISBN"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="ISBN"
                  component="div"
                  className="error-message"
                />
              </div>

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
                  htmlFor="price"
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
                  id="price"
                  name="price"
                  style={{
                    width: "95%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="error
-message"
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

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  style={{
                    width: "45%",
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
                  {isSubmitting ? "Adding..." : "Add Book"}
                </button>

                <button
                  style={{
                    width: "45%",
                    padding: "10px",
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBook;
