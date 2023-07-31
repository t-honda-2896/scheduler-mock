import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import Theme from "../../styles/Theme";
import media from "../../styles/MediaStyle";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Path } from "../../contexts/path-context";
import { PathNameEnum } from "../../enum/path-enum";

export interface Menu {
  label: string;
  toUrl: PathNameEnum;
  icon: React.ReactElement;
}

interface P {
  entityName: string;
  menus: Menu[];
}

export const SideBar: React.FC<P> = React.memo((props) => {
  const { entityName, menus } = props;
  const { linkTo } = useContext(Path);
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClicked = useCallback(
    (idx) => {
      setSelectedIdx(idx);
      linkTo(menus[idx].toUrl);
    },
    [menus, setSelectedIdx]
  );

  return (
    <Container isOpen={isOpen}>
      {entityName && (
        <Header isOpen={isOpen}>
          <EntityName isOpen={isOpen}>{entityName}</EntityName>
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
  width: ${({ isOpen }) => (isOpen ? "324px" : "90px")};
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
  justify-content: space-between;
  align-items: center;
  height: 46px;
`;
const EntityName = styled.div<{ isOpen: boolean }>`
  font-size: ${Theme.typography.fontSize.twenty}px;
  width: ${({ isOpen }) => (isOpen ? "100%" : "0%")};
  transition: width 500ms ease;
  white-space: nowrap;
  height: 100%;
  line-height: 46px;
  ${media.lessThan("medium")`
    font-size: ${Theme.typography.fontSize.sixteen}px;
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
const MenuItem = styled.div<{ selected?: boolean }>`
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
