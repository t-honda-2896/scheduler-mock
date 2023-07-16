import * as React from "react";
import styled from "styled-components";
import media from "../../styles/MediaStyle";
import theme from "../../styles/Theme";
import { generateSchedule } from "../../utils/demo-data-utils";

const Schedule: React.FC = React.memo(() => {
  const schedule = generateSchedule();
  // const json = JSON.stringify(schedule);
  console.log(schedule);
  return (
    <Container>
      <Content>
        <Title>Schedule</Title>
      </Content>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
const Content = styled.div`
  height: 100%;
  flex: 1;
`;

const Title = styled.span`
  font-size: ${theme.typography.fontSize.sixtyFour}px;
  ${media.lessThan("medium")`
    font-size: ${theme.typography.fontSize.twentyFour}px;
  `}
`;
export default Schedule;
