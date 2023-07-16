import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Theme from "../../styles/Theme";
import media from "../../styles/MediaStyle";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Link } from "react-router-dom";

export interface Menu {
  label: string;
  toUrl: string;
  icon: React.ReactElement;
}

interface P {
  appName?: string;
  menus: Menu[];
}

export const SideBar: React.FC<P> = React.memo((props) => {
  const { appName, menus } = props;
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClicked = useCallback(
    (idx) => {
      setSelectedIdx(idx);
    },
    [setSelectedIdx]
  );

  return (
    <Container isOpen={isOpen}>
      {appName && (
        <Header isOpen={isOpen}>
          {isOpen && (
            <Link to="/" onClick={() => handleClicked(-1)}>
              <Title>{appName}</Title>
            </Link>
          )}
          <IconWrapper onClick={() => setIsOpen(!isOpen)}>
            <MenuOpenIcon fontSize="inherit" />
          </IconWrapper>
        </Header>
      )}
      <MenuContent>
        {menus.map((menu, idx) => (
          <MenuItem
            key={`menu-item-${idx}`}
            selected={selectedIdx === idx}
            onClick={() => handleClicked(idx)}
            to={menu.toUrl}
          >
            <MenuIconWrapper>{menu.icon}</MenuIconWrapper>
            {isOpen && <MenuLabel>{menu.label}</MenuLabel>}
          </MenuItem>
        ))}
      </MenuContent>
    </Container>
  );
});

const Container = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? "384px" : "90px")};
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${Theme.spacing * 2}px ${Theme.spacing * 3}px ${Theme.spacing * 2}px;
  box-shadow: 4px 0 4px -5px rgba(0, 0, 0, 0.6);
  gap: ${Theme.spacing * 2}px;
  transition: width 500ms ease;
`;

const Header = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: ${({ isOpen }) => (isOpen ? "space-between" : "flex-end")};
  align-items: center;
`;
const Title = styled.span`
  font-size: ${Theme.typography.fontSize.twentyFour}px;
  white-space: nowrap;
  ${media.lessThan("medium")`
    font-size: ${Theme.typography.fontSize.twentyFour}px;
  `}
`;
const IconWrapper = styled.div`
  font-size: ${Theme.typography.fontSize.thirtyTwo}px;
  border-radius: 8px;
  border: 1px solid ${Theme.border.gray};
  padding: ${Theme.spacing / 2}px;
  height: 40px;
  cursor: pointer;
`;

const MenuContent = styled.div`
  width: 100%;
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing / 2}px;
`;
const MenuItem = styled(Link)<{ selected?: boolean }>`
  padding: ${Theme.spacing}px;
  display: flex;
  align-items: center;
  gap: ${Theme.spacing}px;
  border-radius: 6px;
  white-space: nowrap;
  cursor: pointer;
  ${({ selected }) => selected && `background: ${Theme.background.lightGray};`}
  transition: 300ms;
  &:hover {
    background: ${Theme.background.lightGray};
  }
`;
const MenuLabel = styled.div`
  color: ${Theme.typography.fontColor.gray};
`;
const MenuIconWrapper = styled.div`
  font-size: ${Theme.typography.fontSize.twentyFour}px;
  height: 24px;
  color: ${Theme.typography.fontColor.gray};
`;
