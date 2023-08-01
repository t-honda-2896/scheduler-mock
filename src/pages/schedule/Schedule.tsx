import React, { useRef } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { SelectBox } from "../../components/input/SelectBox";
import { eachDayOfInterval } from "date-fns";
import { SAMPLE_USERS } from "../../constants/demo-data-constants";
import {
  DisplayMode,
  DisplayModeCorrect,
} from "../../constants/calendar-constants";
import { Button } from "../../components/button/Button";

const X_SCALE = 48;
const Y_SCALE = 194;
const SCALE_HEIGHT = 48;

const Schedule: React.FC = React.memo(() => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollableXRef = useRef<HTMLDivElement>(null);
  const scrollableYRef = useRef<HTMLDivElement>(null);

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

  const dateList = eachDayOfInterval({
    start: new Date(2023, 7, 1),
    end: new Date(2023, 7, 31),
  });

  return (
    <Container>
      <Header>
        <Title>出面表</Title>
        <HeaderFunction>
          <Button text="下書き" onClick={() => {}} />
          <Button text="確定" onClick={() => {}} />
        </HeaderFunction>
      </Header>
      <Content>
        <FunctionArea>
          {/* <SearchBox placeholder="案件を選択してください" /> */}
          <PropositionCard>
            <Row>
              <Cell>
                <Label>企業名</Label>
                <Value>株式会社ユニテック</Value>
              </Cell>
              <Cell>
                <Label>案件名</Label>
                <Value>現場A</Value>
              </Cell>
              <Cell>
                <Label>現場住所</Label>
                <Value>東京都渋谷区</Value>
              </Cell>
              <Cell>
                <Label>工期</Label>
                <Koki>
                  <Value>2023年08月01日</Value>
                  <Value>～</Value>
                  <Value>2023年09月30日</Value>
                </Koki>
              </Cell>
            </Row>
          </PropositionCard>
        </FunctionArea>
        <ScheduleArea>
          <ScheduleHeader>
            <YScale>
              <SelectBox options={["2023年8月", "2023年9月"]} />
            </YScale>
            <ScrollableX ref={scrollableXRef}>
              {dateList.map((date, idx) => (
                <HourScale key={`header-x-cell-${idx}`}>
                  <XScale left>{date.getDate()}</XScale>
                </HourScale>
              ))}
              <DummyScrollBar />
            </ScrollableX>
          </ScheduleHeader>
          <ScheduleBody>
            <ScrollableY ref={scrollableYRef}>
              {SAMPLE_USERS.map((user, idx) => (
                <YScale key={`user-${idx}`}>{user.name}</YScale>
              ))}
              <YScale />
            </ScrollableY>
            <Scrollable
              className="scrollable"
              ref={scrollableRef}
              onScroll={handleScroll}
            >
              {dateList.map((_, idx) => (
                <HourScale key={`header-x-cell-${idx}`}>
                  <XScale left filled />
                </HourScale>
              ))}
              <ScheduleLine startDay={1} days={6} rowNum={0} />
              <ScheduleLine startDay={9} days={6} rowNum={0} />
              <ScheduleLine startDay={17} days={6} rowNum={0} />
              <ScheduleLine startDay={25} days={6} rowNum={0} />
              <ScheduleLine startDay={1} days={4} rowNum={1} />
              <ScheduleLine startDay={7} days={6} rowNum={1} />
              <ScheduleLine startDay={15} days={6} rowNum={1} />
              <ScheduleLine startDay={2} days={5} rowNum={2} />
              <ScheduleLine startDay={9} days={5} rowNum={2} />
              <ScheduleLine startDay={16} days={5} rowNum={2} />
              <ScheduleLine startDay={23} days={5} rowNum={2} />
              <ScheduleLine startDay={30} days={2} rowNum={2} />
              <ScheduleLine startDay={15} days={5} rowNum={3} />
              <ScheduleLine startDay={29} days={3} rowNum={3} />
              <ScheduleLine startDay={1} days={6} rowNum={4} />
              <ScheduleLine startDay={9} days={6} rowNum={4} />
              <ScheduleLine startDay={17} days={6} rowNum={4} />
              <ScheduleLine startDay={25} days={6} rowNum={4} />
              <ScheduleLine startDay={1} days={4} rowNum={5} />
              <ScheduleLine startDay={7} days={6} rowNum={5} />
              <ScheduleLine startDay={15} days={6} rowNum={5} />
              <ScheduleLine startDay={23} days={6} rowNum={5} />
              <ScheduleLine startDay={2} days={5} rowNum={6} />
              <ScheduleLine startDay={16} days={5} rowNum={6} />
              <ScheduleLine startDay={23} days={5} rowNum={6} />
              <ScheduleLine startDay={1} days={6} rowNum={7} />
              <ScheduleLine startDay={9} days={6} rowNum={7} />
              <ScheduleLine startDay={1} days={4} rowNum={8} />
              <ScheduleLine startDay={7} days={6} rowNum={8} />
              <ScheduleLine startDay={15} days={6} rowNum={8} />
              <ScheduleLine startDay={2} days={5} rowNum={9} />
              <ScheduleLine startDay={9} days={5} rowNum={9} />
              <ScheduleLine startDay={16} days={5} rowNum={9} />
              <ScheduleLine startDay={23} days={5} rowNum={9} />
            </Scrollable>
          </ScheduleBody>
        </ScheduleArea>
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
const HeaderFunction = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${theme.spacing * 2}px;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: ${theme.spacing * 4}px;
  flex-direction: column;
  flex: 1;
  padding: ${theme.spacing * 2}px 0;
`;
const FunctionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing * 2}px;
`;
const PropositionCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.background.white};
  border-radius: 12px;
  padding: ${theme.spacing * 2}px ${theme.spacing * 4}px;
  width: max-content;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  gap: ${theme.spacing * 6}px;
`;
const Cell = styled.div`
  // width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing / 2}px;
  padding: ${theme.spacing}px 0;
`;
const Koki = styled.div`
  display: flex;
`;
const Label = styled.div`
  font-size: 13px;
  // font-weight: 700;
  color: ${theme.typography.fontColor.gray};
`;
const Value = styled.div``;
const Title = styled.div`
  font-size: ${theme.typography.fontSize.twenty}px;
`;
const ScheduleArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ScheduleHeader = styled.div`
  width: 100%;
  display: flex;
  height: ${SCALE_HEIGHT}px;

  overflow: visible;
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
  // justify-content: flex-end;
  align-items: center;
  padding: ${theme.spacing}px 0;
  overflow: visible;
`;
const ScheduleBody = styled.div`
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
  startDay: number;
  days: number;
  rowNum: number;
}>`
  display: flex;
  align-items: center;
  padding-left: ${theme.spacing}px;
  position: absolute;
  left: ${({ startDay }) => (startDay - 1) * X_SCALE}px;
  width: ${({ days }) => days * X_SCALE}px;
  top: ${({ rowNum }) => rowNum * SCALE_HEIGHT + 4}px;
  height: ${SCALE_HEIGHT - 8}px;

  border-radius: 6px;
  background: ${theme.primary};
`;
export default Schedule;
