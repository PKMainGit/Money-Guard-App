import s from "./ModalEditTransaction.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeEditModal } from "../../redux/modal/slice";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";

const ModalEditTransaction = () => {
  const dispatch = useDispatch();

  // Закриття по Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeEditModal());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // Закриття по backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeEditModal());
    }
  };

  return (
    <div className={s.backdrop} onClick={handleBackdropClick}>
      <EditTransactionForm />
    </div>
  );
};

export default ModalEditTransaction;
