import { useEffect, useState, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { parse, format } from "date-fns";
import { closeEditModal } from "../../redux/modal/slice";
import { editTransaction } from "../../redux/transactions/operations";
import { selectIsEditID } from "../../redux/modal/selectors";
import { selectTransactions } from "../../redux/transactions/selectors";
import { selectCategories } from "../../redux/statistics/selectors";
import { getCategories } from "../../redux/statistics/operations";
import s from "./EditTransactionForm.module.css";
import { customStyles } from "./customStyles";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { RiCloseLargeLine } from "react-icons/ri";
import clsx from "clsx";
import "react-datepicker/dist/react-datepicker.css";

export default function EditTransactionForm() {
  const dispatch = useDispatch();
  const transactionId = useSelector(selectIsEditID);
  const transactions = useSelector(selectTransactions);
  const transaction = transactions.find((item) => item._id === transactionId);
  const categories = useSelector(selectCategories);
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category,
        label: category,
      })),
    [categories]
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const datePickerRef = useRef(null);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  const schema = useMemo(() => {
    const categoryValues = categories;
    return yup.object().shape({
      date: yup.string().required("Date is required"),
      type: yup
        .string()
        .oneOf(["INCOME", "EXPENSE"])
        .required("Type is required"),
      category: yup
        .object()
        .nullable()
        .shape({
          value: yup
            .string()
            .oneOf(categoryValues)
            .required("Category is required"),
          label: yup.string().required(),
        })
        .required("Category is required"),
      comment: yup.string().nullable(),
      sum: yup
        .number()
        .typeError("Sum must be a number")
        .positive("Sum must be positive")
        .required("Sum is required"),
    });
  }, [categories]);
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: "",
      type: "EXPENSE",
      category: null,
      comment: "",
      sum: "",
    },
  });
  useEffect(() => {
    if (transaction && categoryOptions.length > 0) {
      // Лог: выводим дату транзакции
      console.log("Дата транзакции:", transaction.date);

      // Парсим дату
      const parsedDate = parse(transaction.date, "dd-MM-yyyy", new Date());

      // Лог: выводим результат парсинга
      console.log("Результат парсинга:", parsedDate);

      // Проверяем, является ли дата валидной
      const isValidDate = !isNaN(parsedDate) && parsedDate instanceof Date;

      // Лог: выводим статус валидности даты
      console.log("Дата валидна:", isValidDate);

      // Находим категорию, соответствующую транзакции
      const matchedCategory = categoryOptions.find(
        (opt) => opt.value === transaction.category
      );

      // Лог: выводим найденную категорию
      console.log("Найденная категория:", matchedCategory);

      // Переопределяем состояние с новыми данными
      reset({
        date: isValidDate ? format(parsedDate, "dd-MM-yyyy") : "", // Если дата валидна, форматируем, иначе передаем пустую строку
        type: transaction.type,
        category: matchedCategory || null, // Используем объект категории, если он найден
        comment: transaction.comment || "",
        sum: Math.abs(transaction.sum),
      });

      // Лог: выводим состояние после reset
      console.log("Состояние после reset:", {
        date: isValidDate ? format(parsedDate, "dd-MM-yyyy") : "",
        type: transaction.type,
        category: matchedCategory || null,
        comment: transaction.comment || "",
        sum: Math.abs(transaction.sum),
      });

      // Лог: проверяем состояние isChecked
      setIsChecked(transaction.type === "EXPENSE");
      console.log("isChecked:", transaction.type === "EXPENSE");
    }
  }, [transaction, categoryOptions, reset]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  const toggleType = () => {
    setIsChecked((prev) => !prev);
    const newType = !isChecked ? "EXPENSE" : "INCOME";
    setValue("type", newType);
  };
  const onSubmit = (data) => {
    if (!transaction) return;
    const updatedTransaction = {
      ...data,
      category: data.category?.value || "",
      sum: Math.abs(data.sum),
    };
    dispatch(
      editTransaction({ id: transactionId, transaction: updatedTransaction })
    );
    dispatch(closeEditModal());
  };
  return (
    <div className={s.formContainer}>
      <button
        type="button"
        className={isMobile ? s.hiden : s.modalCloseBtn}
        onClick={() => dispatch(closeEditModal())}
      >
        <RiCloseLargeLine className={s.closeIcon} />
      </button>
      <h1 className={s.title}>Edit transaction</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={s.type} onClick={toggleType}>
          <div
            className={clsx(
              s.type_income,
              s.type_text,
              !isChecked && s.income_active
            )}
          >
            Income
          </div>
          <div className={s.type_svg}>
            <svg width="10" height="22" viewBox="0 0 10 22" fill="none">
              <path
                d="M8.80108 1.09786L1.19895 20.9021"
                stroke="#E0E0E0"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div
            className={clsx(
              s.type_expense,
              s.type_text,
              isChecked && s.expense_active
            )}
          >
            Expense
          </div>
        </div>
        {isChecked && (
          <div className={s.comment}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  options={categoryOptions}
                  placeholder="Select a category"
                  styles={customStyles}
                  classNamePrefix="react-select"
                  className={s.select_form}
                  menuIsOpen={menuIsOpen}
                  onMenuOpen={() => setMenuIsOpen(true)}
                  onMenuClose={() => setMenuIsOpen(false)}
                  components={{
                    DropdownIndicator: () =>
                      menuIsOpen ? (
                        <GoChevronUp className={s.iconSelect} />
                      ) : (
                        <GoChevronDown className={s.iconSelect} />
                      ),
                  }}
                />
              )}
            />
            {errors.category && (
              <span className={s.comment_err}>{errors.category.message}</span>
            )}
          </div>
        )}
        <div className={s.sum_data_wrap}>
          <div className={s.sum_wrap}>
            <input
              {...register("sum")}
              type="number"
              placeholder="0.00"
              className={s.sum}
              autoComplete="off"
            />
            {errors.sum && (
              <span className={s.comment_err}>{errors.sum.message}</span>
            )}
          </div>
          <div
            className={s.data_wrap}
            onClick={() => datePickerRef.current?.setFocus()}
          >
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={
                    field.value
                      ? parse(field.value, "dd-MM-yyyy", new Date())
                      : null
                  } // Парсим значение, если оно есть
                  onChange={(date) =>
                    field.onChange(format(date, "dd-MM-yyyy"))
                  } // Форматируем дату при изменении
                  dateFormat="dd.MM.yyyy" // Устанавливаем отображение даты в формате dd-MM-yyyy
                  className={s.customDatePicker}
                  calendarClassName={s.calendarClassName}
                  maxDate={new Date()}
                />
              )}
            />
            <div className={s.svg_wrap}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"
                  fill="#734AEF"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={clsx(s.comment, s.comment_bottom)}>
          <input
            {...register("comment")}
            type="text"
            placeholder="Comment"
            className={s.input}
            autoComplete="off"
          />
          {errors.comment && (
            <span className={s.comment_err}>{errors.comment.message}</span>
          )}
        </div>
        <div className={s.btn_wrap}>
          <button type="submit" className={clsx(s.btn, s.btn_add)}>
            Save
          </button>
          <button
            type="button"
            className={clsx(s.btn, s.btn_cancel)}
            onClick={() => dispatch(closeEditModal())}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
