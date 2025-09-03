import { useSelector } from "react-redux";
import { selectCategories } from "../../redux/statistics/selectors";
import { selectTotalBalance } from "../../redux/auth/selectors";
import styles from "./Chart.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { selectSummary } from "../../redux/statistics/selectors";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  const categoriesData = useSelector(selectCategories) || [];
  const balance = useSelector(selectTotalBalance) ?? 0;
  const { expenseSummary } = useSelector(selectSummary) ?? 0;

  const categoryColors = {
    "Main expenses": "#FFD700",
    Products: "#FFCCCB",
    Car: "#FFA07A",
    "Self care": "#D8BFD8",
    "Child care": "#ADD8E6",
    "Household products": "#4682B4",
    Education: "#AFEEEE",
    Leisure: "#00FA9A",
    "Other expenses": "#00CED1",
    Entertainment: "#E16E6E",
  };

  if (!categoriesData.length) {
    return <div className={styles.container}>No data available</div>;
  }

  const data = {
    labels: categoriesData.map((c) => c.category),
    datasets: [
      {
        data: categoriesData.map((c) => c.total),
        backgroundColor: categoriesData.map(
          (c) => categoryColors[c.category] || "#808080"
        ),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ₴${ctx.raw.toLocaleString("uk-UA", {
              minimumFractionDigits: 2,
            })}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Doughnut data={data} options={options} />
        <div className={styles.balanceDisplay}>
          <p className={styles.balanceAmount}>
            ₴ {expenseSummary.toLocaleString("uk-UA", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
