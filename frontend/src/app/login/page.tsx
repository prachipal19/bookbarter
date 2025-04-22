"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import Layout from "../components/Layout";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short!").required("Required"),
});

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Check for HTTP error response
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Login failed:", errorData);
        setLoginError(errorData.message || "Invalid email or password");
        return;
      }

      // Successful login
      const data = await response.json();
      console.log("Login success:", data);

      const { token } = data;
      localStorage.setItem("token", token);

      setIsLoggedIn(true);
      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            "gray",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
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
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "100px", marginBottom: "20px" }}
            />
            <h1 style={{ fontSize: "24px", marginTop: "8px" }}>Login</h1>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                isSubmitting,
                errors,
                touched,
                handleChange,
                handleBlur,
                values,
              }) => (
                <Form style={{ width: "100%" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      htmlFor="email"
                      style={{
                        fontSize: "16px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      style={{
                        width: "95%",
                        padding: "10px",
                        borderRadius: "4px",
                        border:
                          errors.email && touched.email
                            ? "1px solid red"
                            : "1px solid #ccc",
                      }}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      htmlFor="password"
                      style={{
                        fontSize: "16px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      style={{
                        width: "95%",
                        padding: "10px",
                        borderRadius: "4px",
                        border:
                          errors.password && touched.password
                            ? "1px solid red"
                            : "1px solid #ccc",
                      }}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.password}
                      </div>
                    )}
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
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            {loginError && (
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "14px",
                  color: "red",
                  textAlign: "center",
                }}
              >
                {loginError}
              </p>
            )}
            <hr
              style={{
                width: "100%",
                margin: "20px 0",
                border: "none",
                borderBottom: "1px solid #ccc",
              }}
            />

            <div>
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#3b5998",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaFacebookSquare style={{ marginRight: "4px" }} /> Facebook
              </button>
              <br />
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#db4437",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaGoogle style={{ marginRight: "4px" }} /> Google
              </button>
            </div>

            <p
              style={{
                marginTop: "20px",
                fontSize: "14px",
                color: "gray",
                textAlign: "center",
              }}
            >
              Do not have an account? <Link href="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
