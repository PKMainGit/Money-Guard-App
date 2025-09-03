import Balance from "../Balance/Balance";
import TransactionList from "../TransactionsList/TransactionsList/TransactionsList";
import useMedia from "../../hooks/UseMadia";
import s from "./Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { openAddModal } from "../../redux/modal/slice";


const HomeTab = () => {
  const dispatch = useDispatch();
  const { isMobile, isTablet, isDesctop } = useMedia();
  const handleOpenAddModal = () => {
    dispatch(openAddModal());
  }
  return (
    <div className={s.container}>
      <div className={s.nav_balance}>{isMobile && <Balance />}</div>
      <TransactionList />
      <button className={s.buttonAdd} onClick={handleOpenAddModal}><svg className={s.iconPlus}><use href={"/icons.svg#icon-plus"}></use></svg></button>
    </div>
  );
};

export default HomeTab;
