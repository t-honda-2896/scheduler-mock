import React, { useCallback, useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { Calendar } from "../../components/calendar/Calendar";
const Timeline: React.FC = React.memo(() => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateClicked = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );
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
      </Content>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: ${theme.spacing * 2}px ${theme.spacing * 4}px;
  font-size: ${theme.typography.fontSize.twenty}px;
  border-bottom: 1px solid ${theme.border.lightGray};
`;
const Content = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
`;
const Facet = styled.div`
  width: 248px;
`;
export default Timeline;
