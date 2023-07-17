import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { Calendar } from "../../components/calendar/Calendar";
import {
  addDays,
  addHours,
  differenceInHours,
  eachDayOfInterval,
  endOfDay,
  format,
  getHours,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import {
  DISPLAY_TIME,
  DISPLAY_TIME_FOR_WEEK,
} from "../../constants/date-constants";
import {
  SAMPLE_CONSTRUCTION_SITES,
  SAMPLE_SCHEDULES,
  SampleSchedule,
} from "../../constants/demo-data-constants";
import {
  getConstructionNameById,
  getUserNameById,
} from "../../utils/demo-data-utils";
import {
  DisplayMode,
  DisplayModeLabels,
  DisplayModeOptions,
} from "../../constants/calendar-constants";
import { RadioBox } from "../../components/input/RadioBox";

const X_SCALE = 48;
const Y_SCALE = 194;
const SCALE_HEIGHT = 48;

const X_SCALE_FOR_WEEK = 8;

const Timeline: React.FC = React.memo(() => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollableXRef = useRef<HTMLDivElement>(null);
  const scrollableYRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.WEEK);

  const startAt = useMemo<Date>(
    () =>
      displayMode === DisplayMode.DAY
        ? addHours(startOfDay(selectedDate), DISPLAY_TIME[0])
        : startOfDay(selectedDate),
    [displayMode, selectedDate]
  );
  const endAt = useMemo<Date>(
    () =>
      displayMode === DisplayMode.DAY
        ? endOfDay(selectedDate)
        : endOfDay(addDays(selectedDate, 7)),
    [displayMode, selectedDate]
  );

  const schedulesOfRangeByUser = useMemo<SampleSchedule[]>(() => {
    const schedulesOfRange = SAMPLE_SCHEDULES.filter((schedule) => {
      return (
        isBefore(startAt, new Date(schedule.startAt)) &&
        isBefore(new Date(schedule.startAt), endAt)
      );
    });
    const sortedschedulesOfRange = schedulesOfRange.sort((a, b) => {
      if (a.userId !== b.userId) {
        return a.userId < b.userId ? -1 : 1;
      }
      return a.startAt < b.startAt ? -1 : 1;
    });
    return sortedschedulesOfRange;
  }, [endAt, selectedDate, startAt]);

  const handleRadioClicked = useCallback(
    (option: string): void => {
      setDisplayMode(
        option === DisplayMode.DAY ? DisplayMode.DAY : DisplayMode.WEEK
      );
    },
    [setDisplayMode]
  );

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
      <Header>
        <Title>Timeline</Title>
        <RadioWrapper>
          <RadioBox
            labels={DisplayModeLabels}
            initialValue={displayMode}
            options={DisplayModeOptions}
            onChange={handleRadioClicked}
          />
        </RadioWrapper>
      </Header>
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
              {displayMode === DisplayMode.DAY && (
                <DateLabel>{format(selectedDate, "yyyy年MM月dd日")}</DateLabel>
              )}
            </YScale>
            <ScrollableX ref={scrollableXRef}>
              {displayMode === DisplayMode.DAY &&
                DISPLAY_TIME.map((time, idx) => (
                  <HourScale key={`header-x-cell-${idx}`}>
                    <XScale left>{time}時</XScale>
                    <XScale right />
                  </HourScale>
                ))}
              {displayMode === DisplayMode.WEEK &&
                eachDayOfInterval({ start: startAt, end: endAt }).map(
                  (eachDay, idxForDay) => (
                    <DateScale key={`header-x-cell-${idxForDay}`}>
                      <DateScaleLabel>
                        {format(eachDay, "yyyy年MM月dd日")}
                      </DateScaleLabel>
                      {DISPLAY_TIME_FOR_WEEK.map((time, idxForTime) => (
                        <DateScaleBody key={`hour-scale-${idxForTime}`}>
                          {time % 6 === 0 && (
                            <TimeScaleLabel time={time}>
                              {time}時
                            </TimeScaleLabel>
                          )}
                          <XScale
                            left={time % 6 === 0}
                            displayMode={displayMode}
                          />
                          <XScale displayMode={displayMode} />
                        </DateScaleBody>
                      ))}
                    </DateScale>
                  )
                )}
              <DummyScrollBar />
            </ScrollableX>
          </TimelineHeader>
          <TimelineBody>
            <ScrollableY ref={scrollableYRef}>
              {schedulesOfRangeByUser.map((schedule, idx, prev) => (
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
              {displayMode === DisplayMode.DAY &&
                DISPLAY_TIME.map((_, idx) => (
                  <HourScale key={`header-x-cell-${idx}`}>
                    <XScale left filled />
                    <XScale right filled />
                  </HourScale>
                ))}
              {displayMode === DisplayMode.DAY &&
                schedulesOfRangeByUser.map((schedule, idx) => (
                  <ScheduleLine
                    key={`line-${idx}`}
                    displayMode={displayMode}
                    schedule={schedule}
                    startAt={startAt}
                    rowNum={idx}
                  >
                    {getConstructionNameById(schedule.constructionId)}
                  </ScheduleLine>
                ))}
              {displayMode === DisplayMode.WEEK &&
                eachDayOfInterval({ start: startAt, end: endAt }).map(
                  (_, idxForDay) => (
                    <DateScale key={`header-x-cell-${idxForDay}`}>
                      {DISPLAY_TIME_FOR_WEEK.map((time, idxForTime) => (
                        <HourScale key={`hour-scale-${idxForTime}`}>
                          <XScale
                            left={time % 6 === 0}
                            displayMode={displayMode}
                            filled
                          />
                          <XScale displayMode={displayMode} />
                        </HourScale>
                      ))}
                    </DateScale>
                  )
                )}
              {displayMode === DisplayMode.WEEK &&
                schedulesOfRangeByUser.map((schedule, idx) => (
                  <ScheduleLine
                    key={`line-${idx}`}
                    displayMode={displayMode}
                    schedule={schedule}
                    startAt={startAt}
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
  display: flex;
  border-bottom: 1px solid ${theme.border.lightGray};
  padding: ${theme.spacing * 2}px ${theme.spacing * 4}px;
`;
const Title = styled.div`
  font-size: ${theme.typography.fontSize.twenty}px;
`;
const RadioWrapper = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${theme.spacing}px;

  input[type="radio"]:checked + label {
    background-color: red;
    color: #333;
  }
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
const DateScale = styled.div`
  position: sticky;
  min-width: max-content;
  top: 0;
  bottom: 0;
  display: flex;
`;
const DateScaleLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
`;
const TimeScaleLabel = styled.div<{ time: number }>`
  color: ${theme.typography.fontColor.gray};
  position: absolute;
  bottom: 4px;
  left: ${({ time }) => time * 16 + 4}px;
`;
const DateScaleBody = styled.div`
  min-width: max-content;
  top: 0;
  bottom: 0;
  display: flex;
`;
const HourScale = styled.div`
  position: sticky;
  min-width: max-content;
  top: 0;
  bottom: 0;
  display: flex;
`;
const XScale = styled.div<{
  displayMode?: DisplayMode;
  left?: boolean;
  right?: boolean;
  filled?: boolean;
}>`
  width: ${({ displayMode }) =>
    displayMode === DisplayMode.WEEK ? 8 : X_SCALE}px;
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
  displayMode: DisplayMode;
  schedule: SampleSchedule;
  startAt: Date;
  rowNum: number;
}>`
  color: ${theme.typography.fontColor.white};
  font-size: ${theme.typography.fontSize.twelve}px;
  display: flex;
  align-items: center;
  padding-left: ${theme.spacing}px;
  position: absolute;
  width: ${({ displayMode, schedule }) =>
    differenceInHours(new Date(schedule.endAt), new Date(schedule.startAt)) *
    2 *
    (displayMode === DisplayMode.DAY ? X_SCALE : X_SCALE_FOR_WEEK)}px;
  top: ${({ rowNum }) => rowNum * SCALE_HEIGHT + 4}px;
  height: ${SCALE_HEIGHT - 8}px;
  left: ${({ displayMode, schedule, startAt }) =>
    (differenceInHours(new Date(schedule.startAt), startAt) - 9) *
    (displayMode === DisplayMode.DAY ? X_SCALE : X_SCALE_FOR_WEEK) *
    2}px;

  border-radius: 6px;
  background: ${({ schedule }) =>
    SAMPLE_CONSTRUCTION_SITES.find(
      (site) => site.id === schedule.constructionId
    )!.color};
`;

export default Timeline;
