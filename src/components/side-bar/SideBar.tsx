import React from "react";
import styled from "styled-components";

export interface Menu {
  label: string;
  toUrl: string;
}

interface P {
  menus: Menu[];
}

export const SideBar: React.FC<P> = React.memo((props) => {
  const { menus } = props;
  console.log("menus:", menus);

  return <Container></Container>;
});

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
