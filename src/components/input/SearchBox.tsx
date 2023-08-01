import React from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import SearchIcon from "@mui/icons-material/Search";

interface P {
  placeholder: string;
  onChange?(value: string): void;
}
export const SearchBox: React.FC<P> = React.memo((props) => {
  const { placeholder } = props;

  return (
    <Container>
      <SearchInput placeholder={placeholder} />
      <SearchIconWrapper>
        <SearchIcon fontSize="inherit" />
      </SearchIconWrapper>
    </Container>
  );
});
const Container = styled.div`
  position: relative;
`;
const SearchInput = styled.input`
  background: ${theme.background.white};
  padding: ${theme.spacing}px ${theme.spacing * 2}px ${theme.spacing}px
    ${theme.spacing * 5}px;
  border-radius: 6px;
  border: 1px solid ${theme.border.lightGray};
  ::placeholder {
    font-size: 14px;
    line-height: 120%;
    color: ${theme.typography.fontColor.lightGray};
  }
  min-height: 40px;
`;
const SearchIconWrapper = styled.div`
  position: absolute;
  color: ${theme.typography.fontColor.gray};
  top: 9px;
  left: ${theme.spacing}px;
  font-size: ${theme.typography.fontSize.twentyFour}px;
`;
