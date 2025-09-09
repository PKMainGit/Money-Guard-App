import { useSelector } from "react-redux";
import {
  selectCategories,
  selectStatLoading,
  selectSummary,
} from "../../redux/statistics/selectors";
import styles from "./StatisticsTable.module.css";
import Loader from "../Loader/Loader";

const StatisticsTable = () => {
  const categoriesData = useSelector(selectCategories) || [];
  const isLoading = useSelector(selectStatLoading);
  const { incomeSummary, expenseSummary } = useSelector(selectSummary);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0.00";
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const categoryColors = {
    "Food": "#FFD700",
    Products: "#FFCCCB",
    Car: "#FFA07A",
    "Self care": "#D8BFD8",
    "Child care": "#ADD8E6",
    "Household products": "#4682B4",
    Education: "#AFEEEE",
    Leisure: "#00FA9A",
    "Other": "#00CED1",
    Entertainment: "#E16E6E",
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.categoryHeader}>Category</div>
        <div className={styles.sumHeader}>Sum</div>
      </div>

      <div className={styles.tableBody}>
        {categoriesData.map((category) => (
          <div key={category.category} className={styles.tableRow}>
            <div className={styles.categoryCell}>
              <div
                className={styles.colorIndicator}
                style={{
                  backgroundColor:
                    categoryColors[category.category] || "#808080",
                }}
              ></div>
              {category.category}
            </div>
            <div className={styles.sumCell}>{formatNumber(category.total)}</div>
          </div>
        ))}
      </div>

      <div className={styles.tableSummary}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>Expenses:</div>
          <div className={styles.expensesValue}>
            {formatNumber(expenseSummary)}
          </div>
        </div>
        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>Income:</div>
          <div className={styles.incomeValue}>
            {formatNumber(incomeSummary)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTable;
