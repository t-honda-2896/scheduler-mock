import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import theme from "../../styles/Theme";
import {
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
  getYear,
  getMonth,
  isSameMonth,
  format,
  endOfMonth,
  eachWeekOfInterval,
  endOfWeek,
  isSameDay,
  addDays,
  addMonths,
} from "date-fns";
import { WEEKDAY } from "../../constants/date-constants";

interface P {
  selectedDate: Date;
  handleDateClicked: (date: Date) => void;
}

const getCalendarDates = (year: number, month: number): Date[][] => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = addDays(endOfMonth(startDate), 7);
  const startWeek = startOfWeek(startDate);

  const calendarWeeks = eachWeekOfInterval({
    start: startWeek,
    end: endDate,
  }).slice(0, 6);

  const weeksWithDates = calendarWeeks.map((week) => {
    const weekDates = eachDayOfInterval({ start: week, end: endOfWeek(week) });
    return weekDates;
  });
  return weeksWithDates;
};

export const Calendar: React.FC<P> = React.memo((props) => {
  const { handleDateClicked, selectedDate = new Date() } = props;
  const [calendarDates, setCalendarDates] = useState<Date[][]>([]);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(selectedDate);

  useEffect((): void => {
    if (isSameMonth(prevSelectedDate, selectedDate)) {
      setPrevSelectedDate(selectedDate);
      return;
    }
    setCalendarDates(
      getCalendarDates(getYear(selectedDate), getMonth(selectedDate))
    );
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  useEffect((): void => {
    setCalendarDates(
      getCalendarDates(getYear(selectedDate), getMonth(selectedDate))
    );
  }, []);

  return (
    <Container>
      <Header>
        <LabelOfMonth>{format(selectedDate, "yyyy年MM月")}</LabelOfMonth>
        <IconWrapper
          onClick={() => {
            handleDateClicked(addMonths(selectedDate, -1));
          }}
        >
          <ArrowBackIosIcon fontSize="inherit" />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            handleDateClicked(addMonths(selectedDate, 1));
          }}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconWrapper>
      </Header>
      <Content>
        {calendarDates.length > 0 && (
          <>
            <Row>
              {WEEKDAY.map((day, idx) => (
                <Cell key={`weekday-${idx}`}>{day}</Cell>
              ))}
            </Row>
            {calendarDates.map((calendarWeek, weekIdx) => (
              <Row key={`calendar-week-${weekIdx}`}>
                {calendarWeek.map((dateOfWeek, dateIdx) => (
                  <DateCell
                    key={`date-of-week-${weekIdx}-${dateIdx}`}
                    isThisMonth={isSameMonth(dateOfWeek, selectedDate)}
                    onClick={() => {
                      handleDateClicked(dateOfWeek);
                    }}
                    selected={isSameDay(dateOfWeek, selectedDate)}
                  >
                    {format(dateOfWeek, "dd")}
                  </DateCell>
                ))}
              </Row>
            ))}
          </>
        )}
      </Content>
    </Container>
  );
});

const Container = styled.div`
  width: 248px;
  min-height: 232px;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing * 3}px;
  color: ${theme.typography.fontColor.gray};
  gap: ${theme.spacing}px;
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${theme.spacing / 2}px;
`;
const LabelOfMonth = styled.div`
  margin-right: auto;
  font-size: ${theme.typography.fontSize.sixteen}px;
  line-height: 110%;
`;
const IconWrapper = styled.div`
  font-size: ${theme.typography.fontSize.sixteen}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 300ms;
  cursor: pointer;
  padding: ${theme.spacing}px;
  &:hover {
    background: ${theme.background.lightGray};
  }
`;

const Content = styled.div`
  flex: 1;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Cell = styled.div`
  width: 30px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${theme.typography.fontSize.twelve}px;
`;
const DateCell = styled(Cell)<{ isThisMonth?: boolean; selected?: boolean }>`
  border-radius: 50%;
  transition: 300ms;
  cursor: pointer;

  &:hover {
    background: ${theme.background.lightGray};
  }

  ${({ isThisMonth }) =>
    isThisMonth === false && `color:  ${theme.typography.fontColor.lightGray};`}
  ${({ selected }) =>
    selected &&
    `
      background: ${theme.primary};
      color:  ${theme.typography.fontColor.white};
      &:hover {
        background: ${theme.primary};
      }
    `}
`;
