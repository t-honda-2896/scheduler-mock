import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface P {
  options: string[];
  onChange?(value: string): void;
}
export const SelectBox: React.FC<P> = React.memo((props) => {
  const { options, onChange = () => {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <SelectWrapper>
      <SelectButton onClick={toggleOptions}>
        {selectedOption}
        {isOpen ? (
          <i className="fas fa-chevron-up"></i>
        ) : (
          <i className="fas fa-chevron-down"></i>
        )}
      </SelectButton>
      <WrapperKeyboardArrowDownIcon onClick={toggleOptions}>
        <KeyboardArrowDownIcon fontSize="inherit" />
      </WrapperKeyboardArrowDownIcon>
      {isOpen && (
        <OptionList>
          {options.map((option) => (
            <OptionItem key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </OptionItem>
          ))}
        </OptionList>
      )}
    </SelectWrapper>
  );
});

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  height: min-content;
  overflow: visible;
  width: max-content;
  * {
    overflow: visible;
  }
`;

const SelectButton = styled.div`
  padding: ${theme.spacing}px ${theme.spacing * 5}px ${theme.spacing}px
    ${theme.spacing * 2}px;
  color: ${theme.typography.fontColor.white};
  background-color: ${theme.background.paleNavy};
  border: 1px solid ${theme.border.lightGray};
  border-radius: 4px;
  cursor: pointer;
  min-width: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`;

const WrapperKeyboardArrowDownIcon = styled.div`
  position: absolute;
  right: ${theme.spacing}px;
  top: 8px;
  font-size: ${theme.typography.fontSize.twentyFour}px;
  color: ${theme.typography.fontColor.white};
  cursor: pointer;
`;

const OptionList = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  list-style: none;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 160px;
`;

const OptionItem = styled.li`
  padding: ${theme.spacing}px ${theme.spacing * 5}px ${theme.spacing}px
    ${theme.spacing * 2}px;
  cursor: pointer;
  min-height: 40px;
  z-index: 100;

  &:hover {
    background-color: #f0f0f0;
  }
`;
