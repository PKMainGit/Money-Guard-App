import s from "./ModalAddTransaction.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeAddModal } from "../../redux/modal/slice";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";

const ModalAddTransaction = () => {
  const dispatch = useDispatch();

  // Закриття по Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeAddModal());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // Закриття по backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeAddModal());
    }
  };

  return (
    <div className={s.backdrop} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <AddTransactionForm />
      </div>
    </div>
  );
};

export default ModalAddTransaction;
