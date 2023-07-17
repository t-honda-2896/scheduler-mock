import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { Calendar } from "../../components/calendar/Calendar";
import { differenceInHours, format, isSameDay } from "date-fns";
import { DISPLAY_TIME } from "../../constants/date-constants";
import {
  SAMPLE_CONSTRUCTION_SITES,
  SAMPLE_SCHEDULES,
  SAMPLE_USERS,
  SampleSchedule,
  SampleUser,
} from "../../constants/demo-data-constants";
import { getUserNameById } from "../../utils/demo-data-utils";

const X_SCALE = 48;
const Y_SCALE = 194;
const SCALE_HEIGHT = 48;
const CELL_WIDTH = 48;

interface ScheduleForUser {
  user: SampleUser;
  schedules: SampleSchedule[];
}

const isMatchStartAt = (
  selectedDate: Date,
  schedule: SampleSchedule,
  hour: number,
  minute: number
): boolean =>
  schedule.startAt ===
  `${format(selectedDate, "yyyy-MM-dd")}T${`0${hour}`.slice(
    -2
  )}:${`0${minute}`.slice(-2)}:00Z`;

const Timeline: React.FC = React.memo(() => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollableXRef = useRef<HTMLDivElement>(null);
  const scrollableYRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const schedulesOfTodayByUser = useMemo<SampleSchedule[]>(() => {
    const schedulesOfToday = SAMPLE_SCHEDULES.filter((schedule) => {
      return isSameDay(new Date(schedule.startAt), selectedDate);
    });
    const sortedSchedulesOfToday = schedulesOfToday.sort((a, b) => {
      if (a.userId !== b.userId) {
        return a.userId < b.userId ? -1 : 1;
      }
      return a.startAt < b.startAt ? 1 : -1;
    });
    return sortedSchedulesOfToday;
  }, [selectedDate]);

  console.log("schedulesOfTodayByUser:", schedulesOfTodayByUser);

  const handleDateClicked = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );
  const handleScroll = () => {
    if (
      !scrollableRef.current ||
      !scrollableXRef.current ||
      !scrollableYRef.current
    )
      return;
    const scrollTop = scrollableRef.current.scrollTop;
    const scrollLeft = scrollableRef.current.scrollLeft;
    scrollableXRef.current.scrollLeft = scrollLeft;
    scrollableYRef.current.scrollTop = scrollTop;
  };

  return (
    <Container>
      <Header>Timeline</Header>
      <Content>
        <Facet>
          <Calendar
            selectedDate={selectedDate}
            handleDateClicked={handleDateClicked}
          />
        </Facet>
        <TimelineArea>
          <TimelineHeader>
            <YScale>
              <DateLabel>{format(selectedDate, "yyyy年MM月dd日")}</DateLabel>
            </YScale>
            <ScrollableX ref={scrollableXRef}>
              {DISPLAY_TIME.map((time, idx) => (
                <HourScale key={`header-x-cell-${idx}`}>
                  <XScale left>{time}時</XScale>
                  <XScale right />
                </HourScale>
              ))}
              <DummyScrollBar />
            </ScrollableX>
          </TimelineHeader>
          <TimelineBody>
            <ScrollableY ref={scrollableYRef}>
              {schedulesOfTodayByUser.map((schedule, idx, prev) => (
                <YScale key={`user-${idx}`}>
                  {(idx === 0 || schedule.userId !== prev[idx - 1].userId) &&
                    getUserNameById(schedule.userId)}
                </YScale>
              ))}
            </ScrollableY>
            <Scrollable ref={scrollableRef} onScroll={handleScroll}>
              {DISPLAY_TIME.map((_, idx) => (
                <HourScale key={`header-x-cell-${idx}`}>
                  <XScale left filled />
                  <XScale right filled />
                </HourScale>
              ))}
            </Scrollable>
          </TimelineBody>

          {/* <TimelineBody_2>
            <TimelineOptionItems>
              <TimelineOptionItem></TimelineOptionItem>
              {Object.keys(schedulesOfTodayByUser)
                .sort((a, b) => (Number(a) > Number(b) ? 1 : -1))
                .map((key, idx) => (
                  <TimelineOptionItem
                    key={`timeline-option-item-${idx}`}
                    count={schedulesOfTodayByUser[Number(key)].schedules.length}
                  >
                    {schedulesOfTodayByUser[Number(key)].user.name}
                  </TimelineOptionItem>
                ))}
            </TimelineOptionItems>
            <TimeTable>
              <TimeTableChildRow>
                {DISPLAY_TIME.map((time, idx) => (
                  <TimeTableCells key={`table-cells-${idx}`}>
                    <TimeTableCell left>{time}時</TimeTableCell>
                    <TimeTableCell right />
                  </TimeTableCells>
                ))}
              </TimeTableChildRow>
              {Object.keys(schedulesOfTodayByUser)
                .sort((a, b) => (Number(a) > Number(b) ? 1 : -1))
                .map((key, idx) => (
                  <TimeTableParentRow
                    className="parent-row"
                    key={`parent-row-${idx}`}
                  >
                    {schedulesOfTodayByUser[Number(key)].schedules.map(
                      (schedule, idxOfSchedule) => (
                        <TimeTableChildRow
                          className="child-row"
                          key={`child-row-${idxOfSchedule}`}
                        >
                          {DISPLAY_TIME.map((time, idxOfTime) => (
                            <TimeTableCells
                              key={`table-cells-${idxOfSchedule}-${idxOfTime}`}
                            >
                              <TimeTableCell left>
                                {isMatchStartAt(
                                  selectedDate,
                                  schedule,
                                  time,
                                  0
                                ) && (
                                  <ScheduleLine
                                    schedule={schedule}
                                    hour={time}
                                    minute={0}
                                  ></ScheduleLine>
                                )}
                              </TimeTableCell>
                              <TimeTableCell right>
                                {isMatchStartAt(
                                  selectedDate,
                                  schedule,
                                  time,
                                  30
                                ) && (
                                  <ScheduleLine
                                    schedule={schedule}
                                    hour={time}
                                    minute={30}
                                  ></ScheduleLine>
                                )}
                              </TimeTableCell>
                            </TimeTableCells>
                          ))}
                        </TimeTableChildRow>
                      )
                    )}
                  </TimeTableParentRow>
                ))}
            </TimeTable>
          </TimelineBody_2> */}
        </TimelineArea>
      </Content>
    </Container>
  );
});

const ASD = styled.div`
  min-width: 800px;
  background: red;
`;
const Container = styled.div`
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  m-width: 100%;
  padding: ${theme.spacing * 2}px ${theme.spacing * 4}px;
  font-size: ${theme.typography.fontSize.twenty}px;
  border-bottom: 1px solid ${theme.border.lightGray};
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
`;
const Facet = styled.div`
  width: 248px;
`;
const TimelineArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing * 2}px ${theme.spacing * 4}px;
`;
const TimelineHeader = styled.div`
  width: 100%;
  display: flex;
  height: ${SCALE_HEIGHT}px;
`;
const DummyScrollBar = styled.div`
  min-width: 36px;
`;
const ScrollableX = styled.div`
  flex: 1;
  display: flex;
  overflow-x: visible;

  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const HourScale = styled.div`
  min-width: max-content;
  height: 100%;
  display: flex;
`;
const XScale = styled.div<{
  left?: boolean;
  right?: boolean;
  filled?: boolean;
}>`
  width: ${X_SCALE}px;
  height: ${({ filled }) => (filled ? "100%" : `${SCALE_HEIGHT}px`)};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ left }) => left && `border-left: 1px solid  ${theme.border.gray};`}
  ${({ right }) => right && `border-left: 1px dashed  ${theme.border.gray};`}
`;
const YScale = styled.div`
  width: ${Y_SCALE}px;
  min-height: ${SCALE_HEIGHT}px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: ${theme.spacing}px ${theme.spacing * 2}px;
`;
const DateLabel = styled.div`
  font-size: ${theme.typography.fontSize.twenty}px;
  min-width: max-content;
`;
const TimelineBody = styled.div`
  display: flex;
  flex: 1;
`;
const Scrollable = styled.div`
  flex: 1;
  overflow: scroll;
  display: flex;
  position: relative;
`;

const TimelineBody_2 = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
`;
const TimelineContent = styled.div`
  // width: 100%;
  display: flex;
  height: max-content;
`;
const ScrollableY = styled.div`
  width: 194px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const TimelineOptionItem = styled.div<{ count?: number }>`
  min-height: ${({ count = 1 }) => count * CELL_WIDTH}px;
  padding: ${theme.spacing}px ${theme.spacing * 1.5}px;
  display: flex;
  align-items: center;
`;
const TimeTableParentRow = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
`;
const TimeTableChildRow = styled.div`
  width: max-content;
  display: flex;
  border-right: 1px solid ${theme.border.gray};
  position: relative;
`;
const TimeTableCells = styled.div`
  display: flex;
`;
const TimeTableCell = styled.div<{ left?: boolean; right?: boolean }>`
  min-width: ${CELL_WIDTH}px;
  height: ${CELL_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ left }) => left && `border-left: 1px solid  ${theme.border.gray};`}
  ${({ right }) => right && `border-left: 1px dashed  ${theme.border.gray};`}
`;

const ScheduleLine = styled.div<{
  schedule: SampleSchedule;
  hour: number;
  minute: number;
}>`
  position: absolute;
  width: ${({ schedule }) =>
    differenceInHours(new Date(schedule.endAt), new Date(schedule.startAt)) *
      2 *
      CELL_WIDTH -
    4}px;
  top: 4px;
  bottom: 4px;
  left: ${({ hour, minute }) =>
    (hour - 6) * 2 * CELL_WIDTH + (minute ? CELL_WIDTH : 0) + 2}px;
  border-radius: 6px;
  background: ${({ schedule }) =>
    SAMPLE_CONSTRUCTION_SITES.find(
      (site) => site.id === schedule.constructionId
    )!.color};
`;

export default Timeline;
