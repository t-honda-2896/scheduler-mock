import React from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import Theme from "../../styles/Theme";

export interface Labels {
  [option: string]: string;
}

interface P {
  labels: Labels;
  initialValue: string;
  options: string[];
  onChange(value: string): void;
}
export const RadioBox: React.FC<P> = React.memo((props) => {
  const { labels, initialValue, options, onChange } = props;

  return (
    <Container>
      {options.map((option, idx) => (
        <Label key={`label-${idx}`}>
          <RadioButton
            type="radio"
            value={option}
            checked={option === initialValue}
            onChange={(e) => onChange(e.target.value)}
          />
          <CustomRadio checked={option === initialValue} />
          {labels[option]}
        </Label>
      ))}
    </Container>
  );
});

const Label = styled.label`
  cursor: pointer;
  height: 24px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing}px;
`;
const RadioButton = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;
const CustomRadio = styled.span<{ checked?: boolean }>`
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${Theme.primary};
  margin-right: 4px;
  top: 3px;

  ::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: ${Theme.primary};
    opacity: ${(props) => (props.checked ? "1" : "0")};
  }
`;
