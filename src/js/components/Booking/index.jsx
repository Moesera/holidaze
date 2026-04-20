import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";

import { useApi } from "../../hooks/service/api";
import { closeBooking } from "../../hooks/bookingModal";
import { bookings } from "../../helpers/constant";

const schema = yup
  .object({
    guests: yup.number().positive().integer().typeError("please enter a number").required(),
  })
  .required();

function Booking({ venueId, venueGuests, bookingsArray }) {
  const dispatch = useDispatch();
  const { apiData, isSuccess, isError } = useApi(bookings);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [disableDates, setDisableDates] = useState([]);

  const handleBookingArray = useCallback((bookingsArray) => {
    const dates = bookingsArray.map((booking) => {
      const dateFrom = new Date(booking.dateFrom);
      const dateTo = new Date(booking.dateTo);
      return getDatesBetween(dateFrom, dateTo);
    });
    setDisableDates(dates.flat());
  }, []);

  useEffect(() => {
    if (bookingsArray) {
      handleBookingArray(bookingsArray);
    }
  }, [bookingsArray, handleBookingArray]);

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const method = "POST";
    const updatedData = { ...data, dateFrom: startDate, dateTo: endDate, venueId: venueId };
    apiData(updatedData, method);
  }

  if (isSuccess) {
    setTimeout(() => {
      dispatch(closeBooking());
    }, 2500);
  }

  const FromDate = ({ className, children }) => {
    return (
      <div style={{ color: "#fff" }}>
        <CalendarContainer className={className}>
          <div style={{ position: "relative", width: "20rem", fontSize: "1.2rem" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  }

  return (
    <section className="w-[25rem] h-[40rem] m-2 p-2">
      <div>
      <button className="px-2 mt-1 mb-2 font-medium border rounded-lg hover:opacity-90 bg-error" onClick={() => dispatch(closeBooking())}>
        X
      </button>
      </div>
      <h2>Booking</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <DatePicker
          selectsRange={true}
          onChange={(update) => {
            setDateRange(update);
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          disablePast="true"
          isClearable
          placeholderText="select a date"
          closeOnScroll={true}
          calendarContainer={FromDate}
          // withPortal
          excludeDates={disableDates}
          showWeekNumbers
          fixedHeight
          showMonthDropdown
          className="px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-black"
        />
        <label className="flex flex-col">
          guests
          <input {...register("guests")} className="p-2 border rounded-lg" type="number" defaultValue={1} min={1} max={venueGuests} />
          <p className="error-guests">{errors.guests?.message}</p>
        </label>
        <div className="">
          <button className="flex-1 px-4 py-2 border rounded-lg bg-ocean hover:cursor-pointer">Book</button>
        </div>
        {isError && <div className="error">{isError}</div>}
        {isSuccess && <div className="success">Venue was successfully booked</div>}
      </form>
    </section>
  );
}

export default Booking;
