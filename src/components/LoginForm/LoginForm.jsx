import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import { loginThunk, resetPassword } from "../../redux/auth/operations.js";
import { loginSchema } from "../../schemas/schemas.js";

import s from "./LoginForm.module.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import Loader from "../Loader/Loader.jsx";


const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {

      const data = await dispatch(loginThunk(values)).unwrap();
      navigate("/dashboard");
      resetForm();
  };

  const handleResetPassword = (email) => {
    if (!email) {
      toast.error("Please enter your email to reset password");
      return;
    }
  
    dispatch(resetPassword({ email }))
      .unwrap()
      
  };


  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className={s.wrapper}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <div className={s.formik}>
            <Form className={s.form}>
              <div className={s.iconBox}>
                <svg className={s.iconLogo}>
                  <use href={"/icons.svg#icon-logo"}></use>
                </svg>
                <h3 className={s.title}>Money Guard</h3>
              </div>
  
              <div className={s.inputs}>
                <div className={s.label}>
                  <div className={s.iconWrapper}>
                    <FaEnvelope className={s.icon} />
                  </div>
                  <Field
                    className={s.field}
                    type="email"
                    name="email"
                    placeholder="E-mail"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={s.error}
                  />
                </div>
  
                <div className={s.label}>
                  <div className={s.iconWrapper}>
                    <FaLock className={s.icon} />
                  </div>
                  <Field
                    className={s.field}
                    type={passwordVisibility ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                  />
                  {passwordVisibility ? (
                <svg className={s.eyeButton} onClick={handlePasswordVisibility}>
                  <use href={"/icons.svg#icon-eye"}></use>
                </svg>
              ) : (
                <svg className={s.eyeButton} onClick={handlePasswordVisibility}>
                  <use href={"/icons.svg#icon-eye-blocked"}></use>
                </svg>
              )}
                  <ErrorMessage
                    name="password"
                    component="div"
                    className={s.error}
                  />
                </div>
              </div>
              <div className={s.buttonBox}>
              {isSubmitting ? (
                <Loader />
              ) : (
                <>
                  <button type="submit" className={s.button_log}>
                    LOG IN
                  </button>
                  <NavLink to="/register" className={s.button_reg}>
                    REGISTER
                  </NavLink>
                </>
              )}
            </div>
            </Form>
            <button
            type="button"
            className={s.forgotBtn}
            onClick={() => handleResetPassword(values.email)}
          >
            Forgot password?
          </button>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
