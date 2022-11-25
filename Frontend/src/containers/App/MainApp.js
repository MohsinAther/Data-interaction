import React, {useEffect} from "react";
import {Layout} from "antd";
import {useDispatch, useSelector} from "react-redux";
import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";

import BelowHeader from "../Topbar/BelowHeader/index";
import Topbar from "../Topbar/index";
import {footerText} from "../../util/config";
import App from "../../routes/index";

import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR
} from "../../constants/ThemeSetting";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import {useRouteMatch} from "react-router-dom";
import {updateWindowWidth} from "../../appRedux/actions";
import AppSidebar from "./AppSidebar";

const {Content, Footer} = Layout;

const getContainerClass = (navStyle) => {
  switch (navStyle) {
    case NAV_STYLE_DARK_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_DEFAULT_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_BELOW_HEADER:
      return "gx-container-wrap";
    case NAV_STYLE_ABOVE_HEADER:
      return "gx-container-wrap";
    default:
      return '';
  }
};

const getNavStyles = (navStyle) => {
  switch (navStyle) {
    case NAV_STYLE_DEFAULT_HORIZONTAL :
      return <HorizontalDefault/>;
    case NAV_STYLE_DARK_HORIZONTAL :
      return <HorizontalDark/>;
    case NAV_STYLE_INSIDE_HEADER_HORIZONTAL :
      return <InsideHeader/>;
    case NAV_STYLE_ABOVE_HEADER :
      return <AboveHeader/>;
    case NAV_STYLE_BELOW_HEADER :
      return <BelowHeader/>;
    case NAV_STYLE_FIXED :
      return <Topbar/>;
    case NAV_STYLE_DRAWER :
      return <Topbar/>;
    case NAV_STYLE_MINI_SIDEBAR :
      return <Topbar/>;
    case NAV_STYLE_NO_HEADER_MINI_SIDEBAR :
      return <NoHeaderNotification/>;
    case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR :
      return <NoHeaderNotification/>;
    default :
      return null;
  }
};

const MainApp = () => {
  const {navStyle} = useSelector(({settings}) => settings);
  const match = useRouteMatch();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(updateWindowWidth(window.innerWidth));
    })
  }, [dispatch]);

  return (
    <Layout className="gx-app-layout p-0 m-0">
      
      <Layout>
        {getNavStyles(navStyle)}
        <Content className={`gx-layout-content ${getContainerClass(navStyle)} p-0 `}>
          <App match={match}/>
         
        </Content>
      </Layout>
    </Layout>
  )
};
export default MainApp;

