import React from "react";
import styled from "styled-components";
import Theme from "../../styles/Theme";

type ButtonType = "default" | "primary" | "secondary";
type Variant = "outline" | "filled";

interface P {
  text: string;
  type?: ButtonType;
  variant?: Variant;
  onClick?(): void;
}

export const Button: React.FC<P> = React.memo((props) => {
  const { text, type = "default", variant = "filled", onClick } = props;
  return (
    <Container type={type} variant={variant} onClick={onClick}>
      {text}
    </Container>
  );
});
const Container = styled.div<{ type: ButtonType; variant: Variant }>`
  font-size: ${Theme.typography.fontSize.sixteen}px;
  ${({ type }) =>
    type === "default" &&
    `background: ${Theme.background.white};
     color: ${Theme.typography.fontColor.black};`}
  ${({ type }) =>
    type === "secondary" &&
    `background: ${Theme.secondary};
     color: ${Theme.typography.fontColor.white};`}
  ${({ type }) =>
    type === "primary" &&
    `background: ${Theme.primary};
     color: ${Theme.typography.fontColor.white};`}
  ${({ variant }) =>
    variant === "outline" && `border: 1px solid ${Theme.border.lightGray};`}
  border-radius: 6px;
  padding: ${Theme.spacing}px ${Theme.spacing * 2}px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`;
