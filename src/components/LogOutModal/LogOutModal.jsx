import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/auth/operations";
import { useState, useEffect } from "react";
import s from "./LogOutModal.module.css";

import FormButton from "../FormButton/FormButton";

const LogOutModal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const addCloseEvent = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", addCloseEvent);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", addCloseEvent);
    };
  }, [closeModal]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logoutThunk())
      .then(() => closeModal())
      .catch((error) => console.error("Logout failed", error));
  };

  const closeOnClickOutside = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={s.overlay} onClick={closeOnClickOutside}>
      <div className={s.modalContent}>
        <div className={s.iconBox}>
          <svg className={s.iconLogo}>
            <use href={"/icons.svg#icon-logo"}></use>
          </svg>
          <h3 className={s.title}>Money Guard</h3>
        </div>

        <p className={s.text}>Are you sure you want to log out?</p>

        <div className={s.buttons}>
          <FormButton text="Logout" handlerFunction={handleLogout} />
          <FormButton
            text="Cancel"
            handlerFunction={closeModal}
            variant="whiteButton"
          />
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
