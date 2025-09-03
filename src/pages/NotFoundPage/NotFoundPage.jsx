import { Link } from "react-router-dom";
import s from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <p className={s.notFound}>404</p>
        <p className={s.text}>Page not found!</p>
        <Link to="/dashboard/home" className={s.multiColorButton}>
          go home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
