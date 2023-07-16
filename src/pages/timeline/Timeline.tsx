import * as React from "react";
import styled from "styled-components";
import media from "../../styles/MediaStyle";
import theme from "../../styles/Theme";
const Timeline: React.FC = React.memo(() => {
  return (
    <Container>
      <Content>
        <Title>Timeline</Title>
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
export default Timeline;
