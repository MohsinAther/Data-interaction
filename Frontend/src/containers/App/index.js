import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import {ConfigProvider} from 'antd';
import {IntlProvider} from "react-intl";

import AppLocale from "../../lngProvider";
import MainApp from "./MainApp";

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK
} from "../../constants/ThemeSetting";

const setLayoutType = (layoutType) => {
  if (layoutType === LAYOUT_TYPE_FULL) {
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('framed-layout');
    document.body.classList.add('full-layout');
  } else if (layoutType === LAYOUT_TYPE_BOXED) {
    document.body.classList.remove('full-layout');
    document.body.classList.remove('framed-layout');
    document.body.classList.add('boxed-layout');
  } else if (layoutType === LAYOUT_TYPE_FRAMED) {
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('full-layout');
    document.body.classList.add('framed-layout');
  }
};

const setNavStyle = (navStyle) => {
  if (navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
    navStyle === NAV_STYLE_DARK_HORIZONTAL ||
    navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
    navStyle === NAV_STYLE_ABOVE_HEADER ||
    navStyle === NAV_STYLE_BELOW_HEADER) {
    document.body.classList.add('full-scroll');
    document.body.classList.add('horizontal-layout');
  } else {
    document.body.classList.remove('full-scroll');
    document.body.classList.remove('horizontal-layout');
  }
};

const App = (props) => {
  const {match, location} = props;
  const locale = useSelector(({settings}) => settings.locale);
  const navStyle = useSelector(({settings}) => settings.navStyle);
  const layoutType = useSelector(({settings}) => settings.layoutType);
  const themeType = useSelector(({settings}) => settings.themeType);
  const isDirectionRTL = useSelector(({settings}) => settings.isDirectionRTL);

  useEffect(() => {
    if (isDirectionRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.setAttribute('data-direction', 'rtl')
    } else {
      document.documentElement.classList.remove('rtl');
      document.documentElement.setAttribute('data-direction', 'ltr')
    }
  }, [isDirectionRTL]);

  useEffect(() => {
    if (locale)
      document.documentElement.lang = locale.locale;
  }, [locale]);

  useEffect(() => {
    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add('dark-theme');
    } else if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
    }
  }, [themeType]);

  useEffect(() => {
    setLayoutType(layoutType);
    setNavStyle(navStyle);
  }, [layoutType, navStyle]);

  if (location.pathname === '/') {
    return (<Redirect to={'/sample'}/>);
  }

  const currentAppLocale = AppLocale[locale.locale];

  return (
    <ConfigProvider locale={currentAppLocale.antd} direction={isDirectionRTL ? 'rtl' : 'ltr'}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}>
        <Route path={`${match.url}`} component={MainApp}/>
      </IntlProvider>
    </ConfigProvider>
  )
};

export default App;
