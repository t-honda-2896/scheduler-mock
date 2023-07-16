import * as React from "react";
import styled from "styled-components";
import { Menu, SideBar } from "../components/side-bar/SideBar";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Route } from "react-router-dom";
import Timeline from "./timeline/Timeline";
import Schedule from "./schedule/Schedule";
import Home from "./home/Home";

const SIDE_MENUS: Menu[] = [
  {
    label: "タイムライン",
    toUrl: "/timeline",
    icon: <ViewTimelineIcon fontSize="inherit" />,
  },
  {
    label: "スケジュール",
    toUrl: "/schedule",
    icon: <CalendarMonthIcon fontSize="inherit" />,
  },
];

const Pages: React.FC = React.memo(() => {
  return (
    <Container>
      <SideBar appName="Scheduler-Mock" menus={SIDE_MENUS} />
      <Content>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/timeline">
          <Timeline />
        </Route>
        <Route path="/schedule">
          <Schedule />
        </Route>
      </Content>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
const Content = styled.div`
  height: 100%;
  flex: 1;
`;
export default Pages;
