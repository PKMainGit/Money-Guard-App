import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../../redux/auth/operations";
import { useForm } from "react-hook-form";
import css from "./ChangePasswordPage.module.css";
import PasswordStrengthBar from "react-password-strength-bar-with-style-item";
import clsx from "clsx";
import { useState } from "react";


const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState(false);


const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  if (!token) {
    return <p>Invalid or missing token.</p>;
  }

  const onSubmit = (values) => {
    const { confirmPassword, ...payload } = values;
    dispatch(changePassword({ token, password: payload.password }))
      .unwrap()
      .then(() => navigate("/login"));
  };

  register("password", {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 8 characters"
    },
  })
  
  register("confirmPassword", {
    required: "Please confirm your password",
    validate: (value) =>
      value === watch("password") || "Passwords do not match",
  })

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.logoThumb}>
          <svg className={css.iconLogo}>
            <use href={"/icons.svg#icon-logo"}></use>
          </svg>
          <p className={css.title}>Money Guard</p>
          <p className={css.title1}>Enter a new password</p>
        </div>

        <div className={css.fieldThumb}>
          <div className={css.iconThumb}>
            <svg className={css.icon}>
              <use href={"/icons.svg#icon-lock"}></use>
            </svg>
            <input
              {...register("password")}
              type={passwordVisibility ? "text" : "password"}
              className={css.field}
              placeholder="Password"
            ></input>

            {passwordVisibility ? (
              <svg className={css.eyeButton} onClick={handlePasswordVisibility}>
                <use href={"/icons.svg#icon-eye"}></use>
              </svg>
            ) : (
              <svg className={css.eyeButton} onClick={handlePasswordVisibility}>
                <use href={"/icons.svg#icon-eye-blocked"}></use>
              </svg>
            )}
          </div>
          <div className={css.errorThumb}>
            <div className={css.error}>{errors.password?.message}</div>
          </div>
        </div>

        <div className={css.fieldThumb}>
          <div className={css.iconThumb}>
            <svg className={css.icon}>
              <use href={"/icons.svg#icon-lock"}></use>
            </svg>
            <input
              {...register("confirmPassword")}
              type={confirmPasswordVisibility ? "text" : "password"}
              className={css.field}
              placeholder="Confirm password"
            ></input>
            {confirmPasswordVisibility ? (
              <svg
                className={css.eyeButton}
                onClick={handleConfirmPasswordVisibility}
              >
                <use href={"/icons.svg#icon-eye"}></use>
              </svg>
            ) : (
              <svg
                className={css.eyeButton}
                onClick={handleConfirmPasswordVisibility}
              >
                <use href={"/icons.svg#icon-eye-blocked"}></use>
              </svg>
            )}
          </div>
          <div className={clsx(css.errorThumb, css.marginErrorThumb)}>
            <div className={css.error}>{errors.confirmPassword?.message}</div>
          </div>
          <div className={css.passwordStrengthBarThumb}>
            <PasswordStrengthBar
              password={watch("password")}
              className={css.passwordStrengthBar}
              scoreWordClassName={css.scoreWordClassName}
              minLength={8}
              minScore={1}
              barColors={["#ddd", "#FFB627", "#f6b44d", "#2b90ef", "#25c281"]}
              scoreWords={["weak", "weak", "okay", "good", "strong"]}
            />
          </div>
        </div>

        <div className={css.buttonThumb}>
          <button type="submit" className={clsx(css.button, css.confirmButton)}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;




















