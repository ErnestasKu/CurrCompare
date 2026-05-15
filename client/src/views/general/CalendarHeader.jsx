import React from "react";
import { getYear, getMonth } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Dropdown from "./Dropdown";
import CalendarDropdown from "./CalendarDropdown";

// replacement for the default datepicker header
export default function CalendarHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) {
  // frankfurter API supports from 1948
  const FROM_DATE = 1948;
  const currentYear = getYear(new Date());
  const years = Array.from({ length: currentYear - FROM_DATE + 1 }, (_, i) =>
    (FROM_DATE + i).toString(),
  ).reverse();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthName = months[getMonth(date)];
  const currentYearName = getYear(date).toString();

  return (
    <div className="flex items-center justify-between h-12 px-2 border-b bg-bg-lighter border-bg-border rounded-t-xl">
      <button
        type="button"
        className="p-1 text-2xl transition-colors rounded-lg text-primary hover:bg-primary/10 disabled:opacity-0"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <IoIosArrowBack />
      </button>

      <div className="flex items-center gap-0.5">
        <CalendarDropdown
          data={months}
          selected={currentMonthName}
          onChange={(m) => changeMonth(months.indexOf(m))}
          widthClass="w-28"
        />
        <span className="text-bg-border">|</span>
        <CalendarDropdown
          data={years}
          selected={currentYearName}
          onChange={(y) => changeYear(parseInt(y))}
          widthClass="w-fit"
        />
      </div>

      <button
        type="button"
        className="p-1 text-2xl transition-colors rounded-lg text-primary hover:bg-primary/10 disabled:opacity-0"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
}
