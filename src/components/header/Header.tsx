import React from "react";
import styled from "styled-components";
import Theme from "../../styles/Theme";
import media from "../../styles/MediaStyle";
import { PathNameEnum } from "../../enum/path-enum";
import { Button } from "../button/Button";

export interface Menu {
  label: string;
  toUrl: PathNameEnum;
  icon: React.ReactElement;
}

export const Header: React.FC = React.memo(() => {
  return (
    <Container>
      <Title>Scheduler-mock</Title>
      <FunctionArea>
        <Button text="通知" type="primary" />
        <Button text="Help" type="secondary" />
        <Button text="ナレッジ 太郎" />
      </FunctionArea>
    </Container>
  );
});

const Container = styled.div`
  width: 100%
  height: 48px;
  display: flex;
  justify-content: space-between;
  padding: ${Theme.spacing * 2}px ${Theme.spacing * 3}px ${Theme.spacing * 2}px;
  border-bottom: 1px solid ${Theme.border.gray};
  box-shadow: 4px 4 4px -5px rgba(0, 0, 0, 0.6);
  gap: ${Theme.spacing * 2}px;
  transition: width 500ms ease;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: ${Theme.typography.fontSize.thirtyTwo}px;
  white-space: nowrap;
  &:hover {
    cursor: pointer;
  }
  ${media.lessThan("medium")`
    font-size: ${Theme.typography.fontSize.twentyFour}px;
  `}
`;

const FunctionArea = styled.div`
  display: flex;
  gap: ${Theme.spacing * 2}px;
`;
