import { BsPlus } from "react-icons/bs";
import s from "./ButtonAddTransactions.module.css";
import { openAddModal } from "../../redux/modal/slice.js";
import { useDispatch } from "react-redux";

const ButtonAddTransactions = () => {
  const dispatch = useDispatch();

  return (
    <div className={s.wrap}>
      <button
        className={s.btn}
        type="button"
        onClick={() => {
          dispatch(openAddModal());
        }}
      >
        <BsPlus className={s.icon} />
      </button>
    </div>
  );
};

export default ButtonAddTransactions;
