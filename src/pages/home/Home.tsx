import * as React from "react";
import styled from "styled-components";
import media from "../../styles/MediaStyle";
import theme from "../../styles/Theme";

const Home: React.FC = React.memo(() => {
  return (
    <Container>
      <Title>React-base-app-typescript</Title>;
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.span`
  font-size: ${theme.typography.fontSize.sixtyFour}px;
  ${media.lessThan("medium")`
    font-size: ${theme.typography.fontSize.twentyFour}px;
  `}
`;
export default Home;
