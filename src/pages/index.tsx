import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Menu, SideBar } from "../components/side-bar/SideBar";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Timeline from "./timeline/Timeline";
import Schedule from "./schedule/Schedule";
import Home from "./home/Home";
import { Path } from "../contexts/path-context";
import { PathNameEnum } from "../enum/path-enum";
import { Header } from "../components/header/Header";

const SIDE_MENUS: Menu[] = [
  {
    label: "出面表",
    toUrl: PathNameEnum.SCHEDULE,
    icon: <CalendarMonthIcon fontSize="inherit" />,
  },
  {
    label: "稼働状況",
    toUrl: PathNameEnum.TIMELINE,
    icon: <ViewTimelineIcon fontSize="inherit" />,
  },
];

const Pages: FC = React.memo(() => {
  const { to } = useContext(Path);
  return (
    <Container>
      <Header />
      <Body>
        <SideBar entityName="株式会社 〇〇〇〇" menus={SIDE_MENUS} />
        <Content>
          {to === PathNameEnum.HOME && <Home />}
          {to === PathNameEnum.SCHEDULE && <Schedule />}
          {to === PathNameEnum.TIMELINE && <Timeline />}
        </Content>
      </Body>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Body = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;
const Content = styled.div`
  height: 100%;
  flex: 1;
`;
export default Pages;
