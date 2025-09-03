import s from './ModalRepeatTransaction.module.css'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeRepeatModal } from "../../redux/modal/slice";
import { copyTransaction }from '../../redux/transactions/operations'

const ModalRepeatTransaction = () => {
	const dispatch = useDispatch();
	const id = useSelector((state) => state.modals.repeatTransactionId);
	const handleCopyTransaction = (id) => {
		dispatch(closeRepeatModal());
    dispatch(copyTransaction(id));
  };

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				dispatch(closeRepeatModal());
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dispatch]);

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			dispatch(closeRepeatModal());
		}
	};

	 const handleNoClick = () => {
     dispatch(closeRepeatModal());
   };

	return (
    <div className={s.backdrop} onClick={handleBackdropClick}>
      <div className={s.decisionBox}>
        <h3>Do you want to repeat this transaction?</h3>
        <div className={s.btnBox}>
          <button onClick={() => handleCopyTransaction(id)}>Yes</button>
          <button onClick={handleNoClick}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRepeatTransaction;