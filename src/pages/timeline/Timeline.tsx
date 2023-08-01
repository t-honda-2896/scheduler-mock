import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { Calendar } from "../../components/calendar/Calendar";
import {
  addDays,
  differenceInHours,
  eachDayOfInterval,
  endOfDay,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
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
import {
  DisplayMode,
  DisplayModeCorrect,
  DisplayModeLabels,
  DisplayModeOptions,
} from "../../constants/calendar-constants";
import { RadioBox } from "../../components/input/RadioBox";
// import { CheckBox } from "../../components/input/CheckBox";

const X_SCALE = 48;
const Y_SCALE = 194;
const SCALE_HEIGHT = 48;

const Timeline: React.FC = React.memo(() => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollableXRef = useRef<HTMLDivElement>(null);
  const scrollableYRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.ONE_DAY
  );

  const startAt = useMemo<Date>(() => startOfDay(selectedDate), [selectedDate]);
  const endAt = useMemo<Date>(
    () => endOfDay(addDays(selectedDate, DisplayModeCorrect[displayMode] - 1)),
    [displayMode, selectedDate]
  );

  const schedulesOfRangeByUser = useMemo<SampleSchedule[]>(() => {
    const schedulesOfRange = SAMPLE_SCHEDULES.filter((schedule) => {
      return (
        isBefore(startAt, new Date(schedule.startAt)) &&
        isBefore(new Date(schedule.startAt), endAt)
      );
    });
    const sortedSchedulesOfRange = schedulesOfRange.sort((a, b) => {
      if (a.userId !== b.userId) {
        return a.userId < b.userId ? -1 : 1;
      }
      return a.startAt < b.startAt ? -1 : 1;
    });
    let rowNum = 0;
    const schedulesWithRownum = sortedSchedulesOfRange.map(
      (row, idx, array) => {
        if (idx > 0 && array[idx - 1].userId !== row.userId) rowNum++;
        row.rowNum = rowNum;
        return row;
      }
    );
    return schedulesWithRownum;
  }, [endAt, startAt]);

  const handleRadioClicked = useCallback(
    (option: string): void => {
      setDisplayMode(
        option === DisplayMode.ONE_DAY
          ? DisplayMode.ONE_DAY
          : option === DisplayMode.TWO_DAYS
          ? DisplayMode.TWO_DAYS
          : DisplayMode.THREE_DAYS
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
        <Title>稼働状況</Title>
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
          {/* <CheckBox
            labels={DisplayModeLabels}
            initialValue={displayMode}
            options={DisplayModeOptions}
            onChange={handleRadioClicked}
          /> */}
        </Facet>
        <TimelineArea>
          <TimelineHeader>
            <YScale>
              {displayMode === DisplayMode.ONE_DAY && (
                <DateLabel>{format(selectedDate, "yyyy年MM月dd日")}</DateLabel>
              )}
            </YScale>
            <ScrollableX ref={scrollableXRef}>
              {displayMode === DisplayMode.ONE_DAY &&
                DISPLAY_TIME.map((time, idx) => (
                  <HourScale key={`header-x-cell-${idx}`}>
                    <XScale left>{time}時</XScale>
                    <XScale right />
                  </HourScale>
                ))}
              {displayMode !== DisplayMode.ONE_DAY &&
                eachDayOfInterval({ start: startAt, end: endAt }).map(
                  (eachDay, idxForDay) => (
                    <DateScale key={`header-x-cell-${idxForDay}`}>
                      <DateScaleLabel>
                        {format(eachDay, "yyyy年MM月dd日")}
                      </DateScaleLabel>
                      {DISPLAY_TIME.map((time, idxForTime) => (
                        <DateScaleBody key={`hour-scale-${idxForTime}`}>
                          {time % DisplayModeCorrect[displayMode] === 0 && (
                            <TimeScaleLabel
                              displayMode={displayMode}
                              time={time}
                            >
                              {time}時
                            </TimeScaleLabel>
                          )}
                          <XScale
                            left={time % DisplayModeCorrect[displayMode] === 0}
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
              {schedulesOfRangeByUser.reduce<React.ReactElement[]>(
                (prev, curr, idx, array) => {
                  if (idx === 0 || curr.userId !== array[idx - 1].userId) {
                    prev.push(
                      <YScale key={`user-${idx}`}>
                        {getUserNameById(curr.userId)}
                      </YScale>
                    );
                  }
                  return prev;
                },
                []
              )}
              <YScale />
            </ScrollableY>
            <Scrollable
              className="scrollable"
              ref={scrollableRef}
              onScroll={handleScroll}
            >
              {displayMode === DisplayMode.ONE_DAY &&
                DISPLAY_TIME.map((_, idx) => (
                  <HourScale key={`header-x-cell-${idx}`}>
                    <XScale left filled />
                    <XScale right filled />
                  </HourScale>
                ))}
              {displayMode === DisplayMode.ONE_DAY &&
                schedulesOfRangeByUser.map((schedule, idx) => (
                  <ScheduleLine
                    key={`line-${idx}`}
                    displayMode={displayMode}
                    schedule={schedule}
                    startAt={startAt}
                    rowNum={schedule.rowNum!}
                  >
                    {getConstructionNameById(schedule.constructionId)}
                  </ScheduleLine>
                ))}
              {displayMode !== DisplayMode.ONE_DAY &&
                eachDayOfInterval({ start: startAt, end: endAt }).map(
                  (_, idxForDay) => (
                    <DateScale key={`header-x-cell-${idxForDay}`}>
                      {DISPLAY_TIME.map((time, idxForTime) => (
                        <HourScale key={`hour-scale-${idxForTime}`}>
                          <XScale
                            left={time % DisplayModeCorrect[displayMode] === 0}
                            displayMode={displayMode}
                            filled
                          />
                          <XScale displayMode={displayMode} />
                        </HourScale>
                      ))}
                    </DateScale>
                  )
                )}
              {displayMode !== DisplayMode.ONE_DAY &&
                schedulesOfRangeByUser.map((schedule, idx) => (
                  <ScheduleLine
                    key={`line-${idx}`}
                    displayMode={displayMode}
                    schedule={schedule}
                    startAt={startAt}
                    rowNum={schedule.rowNum!}
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
  gap: ${theme.spacing * 2}px;
  padding: ${theme.spacing * 3}px ${theme.spacing * 4}px;
`;
const Header = styled.div`
  display: flex;
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
  padding: ${theme.spacing * 2}px 0;
`;
const Facet = styled.div`
  width: 248px;
`;
const TimelineArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
const TimeScaleLabel = styled.div<{ displayMode: DisplayMode; time: number }>`
  color: ${theme.typography.fontColor.gray};
  position: absolute;
  bottom: 4px;
  left: ${({ displayMode = DisplayMode.ONE_DAY, time }) =>
    time * (X_SCALE / DisplayModeCorrect[displayMode]) * 2 + 4}px;
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
  width: ${({ displayMode = DisplayMode.ONE_DAY }) =>
    X_SCALE / DisplayModeCorrect[displayMode]}px;
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
      (X_SCALE / DisplayModeCorrect[displayMode]) -
    4}px;
  top: ${({ rowNum }) => rowNum * SCALE_HEIGHT + 4}px;
  height: ${SCALE_HEIGHT - 8}px;
  left: ${({ displayMode, schedule, startAt }) =>
    (differenceInHours(new Date(schedule.startAt), startAt) - 9) *
    (X_SCALE / DisplayModeCorrect[displayMode]) *
    2}px;

  border-radius: 6px;
  background: ${({ schedule }) =>
    SAMPLE_CONSTRUCTION_SITES.find(
      (site) => site.id === schedule.constructionId
    )!.color};
`;

export default Timeline;
