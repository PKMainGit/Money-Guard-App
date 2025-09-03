import { useDispatch, useSelector } from "react-redux";
import styles from "./TransactionItem.module.css";
import { CiEdit } from "react-icons/ci";
import { IoCopySharp } from "react-icons/io5";
import { deleteTransaction } from "../../../redux/transactions/operations";
import clsx from "clsx";
import { openEditModal } from "../../../redux/modal/slice";
import { openRepeatModal } from "../../../redux/modal/slice";

const TransactionItem = ({ id, category, date, sum, type, comment }) => {
  const dispatch = useDispatch();
  const deletedOnKlick = (id) => {
    dispatch(deleteTransaction(id));
  };

  const handleEditModalOpen = (id) => {
    dispatch(openEditModal(id));
  };

  const handleRepeatModalOpen = (id) => {
    dispatch(openRepeatModal(id));
  };

  return (
    <div
      className={clsx(
        styles.transactionListContainer,
        type == "+" && styles.incomeBorderColor,
        type == "INCOME" && styles.incomeBorderColor
      )}
    >
      <ul
        className={clsx(
          styles.transactionList,
          type == "+" && styles.incomeBorderColor,
          type == "INCOME" && styles.incomeBorderColor
        )}
      >
        <li className={styles.listItem}>
          <span className={styles.headerTextMobile}>Date</span>
          <span className={styles.item}>{date}</span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.headerTextMobile}>Type</span>
          <span className={styles.item}>{type === "INCOME" ? "+" : "-"}</span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.headerTextMobile}>Category</span>
          <span className={styles.item}>{category}</span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.headerTextMobile}>Comment</span>
          <span className={styles.item}>{comment}</span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.headerTextMobile}>Sum</span>
          <span
            className={clsx(
              type == "EXPENSE" && styles.expenseTextColor,
              type == "-" && styles.expenseTextColor,
              type == "INCOME" && styles.incomeTextColor,
              type == "+" && styles.incomeTextColor
            )}
          >
            {sum}
          </span>
        </li>
        <li className={styles.deleteEdit}>
          <button
            type="submit"
            onClick={() => {
              deletedOnKlick(id);
            }}
          >
            Delete
          </button>
          <span className={styles.edit} onClick={() => handleEditModalOpen(id)}>
            <CiEdit />
            <span className={styles.tooltip}>Edit your transaction</span>
            <span className={styles.editSpan}>Edit</span>
          </span>
          <span
            className={styles.edit}
            onClick={() => handleRepeatModalOpen(id)}
          >
            <IoCopySharp />
            <span className={styles.tooltip}>Repeat your transaction</span>
            <span className={styles.editSpan}>Repeat</span>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default TransactionItem;
