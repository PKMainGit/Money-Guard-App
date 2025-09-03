import { useEffect, useState } from "react";
import s from "./Header.module.css";
import { IoExitOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import useMedia from "../../hooks/UseMadia";

import {
  openLogOutModal,
  openProfileModal,
  closeProfileModal,
} from "../../redux/modal/slice";
import UserAvatar from "../UserAvatar/UserAvatar";
import { selectIsProfileModalOpen } from "../../redux/modal/selectors";

const Header = () => {
  const dispatch = useDispatch();
  const { isMobile } = useMedia();
  const [animateAvatar, setAnimateAvatar] = useState(false);
  const isProfileModalOpen = useSelector(selectIsProfileModalOpen);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateAvatar(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleEditProfileOpenModal = () => {
    if (isProfileModalOpen) {
      dispatch(closeProfileModal());
    } else {
      dispatch(openProfileModal());
    }
  };

  const handleLogoutOpenModal = () => {
    dispatch(openLogOutModal());
  };

  return (
    <section className={s.header}>
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.logo}>
            <svg className={s.iconLogo}>
              <use href={"/icons.svg#icon-logo"}></use>
            </svg>
            <h3 className={s.title}>Money Guard</h3>
          </div>
          <div className={s.authMenu}>
            <div
              className={`${s.avatar} ${animateAvatar ? s.animate : ""}`}
              onClick={handleEditProfileOpenModal}
            >
              <UserAvatar size={32} fontSize={14} borderRadius={8} />
            </div>
            {!isMobile && <div className={s.line}></div>}
            <div className={s.exit} onClick={handleLogoutOpenModal}>
              <IoExitOutline className={s.exitIcon} />
              {!isMobile && <p className={s.exitText}>Exit</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
