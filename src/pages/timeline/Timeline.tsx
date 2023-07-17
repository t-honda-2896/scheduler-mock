import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { Calendar } from "../../components/calendar/Calendar";
import { differenceInHours, format, getHours, isSameDay } from "date-fns";
import { DISPLAY_TIME } from "../../constants/date-constants";
import {
  SAMPLE_CONSTRUCTION_SITES,
  SAMPLE_SCHEDULES,
  SampleSchedule,
} from "../../constants/demo-data-constants";
import {
  getConstructionNameById,
  getUserNameById,
} from "../../utils/demo-data-utils";

const X_SCALE = 48;
const Y_SCALE = 194;
const SCALE_HEIGHT = 48;
const CELL_WIDTH = 48;

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
      return a.startAt < b.startAt ? -1 : 1;
    });
    return sortedSchedulesOfToday;
  }, [selectedDate]);

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
              <YScale />
            </ScrollableY>
            <Scrollable
              className="scrollable"
              ref={scrollableRef}
              onScroll={handleScroll}
            >
              {DISPLAY_TIME.map((_, idx) => (
                <HourScale key={`header-x-cell-${idx}`}>
                  <XScale left filled />
                  <XScale right filled />
                </HourScale>
              ))}
              {schedulesOfTodayByUser.map((schedule, idx) => (
                <ScheduleLine
                  key={`line-${idx}`}
                  schedule={schedule}
                  rowNum={idx}
                >
                  {getConstructionNameById(schedule.constructionId)}
                </ScheduleLine>
              ))}
            </Scrollable>
          </TimelineBody>
        </TimelineArea>
      </Content>
    </Container>
  );
});

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
  position: sticky;
  min-width: max-content;
  top: 0;
  bottom: 0;
  display: flex;
`;
const XScale = styled.div<{
  left?: boolean;
  right?: boolean;
  filled?: boolean;
}>`
  width: ${X_SCALE}px;
  height: ${({ filled }) => (filled ? "auto" : `${SCALE_HEIGHT}px`)};
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
  // padding-bottom: 64px;
  height: auto;
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

const ScheduleLine = styled.div<{
  schedule: SampleSchedule;
  rowNum: number;
}>`
  color: ${theme.typography.fontColor.white};
  display: flex;
  align-items: center;
  padding-left: ${theme.spacing}px;
  position: absolute;
  width: ${({ schedule }) =>
    differenceInHours(new Date(schedule.endAt), new Date(schedule.startAt)) *
      2 *
      CELL_WIDTH -
    4}px;
  top: ${({ rowNum }) => rowNum * SCALE_HEIGHT + 4}px;
  height: ${SCALE_HEIGHT - 8}px;
  left: ${({ schedule }) =>
    (getHours(new Date(schedule.startAt)) - 15) * 2 * X_SCALE + 2}px;
  border-radius: 6px;
  background: ${({ schedule }) =>
    SAMPLE_CONSTRUCTION_SITES.find(
      (site) => site.id === schedule.constructionId
    )!.color};
`;

export default Timeline;
