import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { closeProfileModal } from "../../redux/modal/slice";
import s from "./UserModal.module.css";
import { selectUser } from "../../redux/auth/selectors";
import { editUserAvatar, editUserName } from "../../redux/auth/operations";
import UserAvatar from "../UserAvatar/UserAvatar";
import useMedia from "../../hooks/UseMadia";
import FormButton from "../FormButton/FormButton";

const UserModal = () => {
  const dispatch = useDispatch();
  const { isMobile } = useMedia();
  const { name: currentName, avatar: currentAvatar } = useSelector(selectUser);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: currentName },
    mode: "onChange",
  });

  const [avatar, setAvatar] = useState(currentAvatar);
  const [file, setFile] = useState(null);

  const watchedName = watch("name");

  const onSubmit = async (data) => {
    if (!data.name.trim() && !file) return;

    const namePromise = data.name.trim()
      ? dispatch(editUserName({ name: data.name.trim() }))
      : null;

    const avatarPromise = file
      ? dispatch(editUserAvatar({ avatar: file }))
      : null;

    try {
      await Promise.all([namePromise, avatarPromise]);
      dispatch(closeProfileModal());
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const closeModal = () => dispatch(closeProfileModal());

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={s.overlay} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <button className={s.closeBtn} onClick={closeModal}>
          <svg className={s.iconClose}>
            <use href={"/icons.svg#icon-close"}></use>
          </svg>
        </button>
        <p className={s.text}>Edit profile</p>

        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <label className={s.avatarLabel}>
            {isMobile ? (
              <UserAvatar
                customAvatar={avatar}
                size={96}
                borderRadius={11}
                fontSize={48}
              />
            ) : (
              <UserAvatar
                customAvatar={avatar}
                size={68}
                borderRadius={8}
                fontSize={36}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={s.hiddenFileInput}
            />
            <div className={s.plusIcon}>
              <svg className={s.iconPlus}>
                <use href={"/icons.svg#icon-plus"}></use>
              </svg>
            </div>
          </label>

          <div className={s.labelBox}>
            <input
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s'-]+$/,
                  message: "Error: You can add only letters",
                },
              })}
              placeholder="Enter your name"
              defaultValue={currentName}
              className={`${s.input} ${errors.name ? s.errorInput : ""}`}
            />
            {errors.name && <p className={s.error}>{errors.name.message}</p>}
          </div>

          <button
            type="submit"
            className={s.saveBtn}
            disabled={!watchedName || !!errors.name}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
