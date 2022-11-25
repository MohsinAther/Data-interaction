import React from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

const SidebarLogo = ({sidebarCollapsed, setSidebarCollapsed}) => {
  const {width, themeType} = useSelector(({settings}) => settings);
  let navStyle = useSelector(({settings}) => settings.navStyle);
  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }

  return (
    <div className="gx-layout-sider-header">
      {(navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) ? <div className="gx-linebar">
        <i
          className={`gx-icon-btn icon icon-${!sidebarCollapsed ? 'menu-unfold' : 'menu-fold'} ${themeType !== THEME_TYPE_LITE ? 'gx-text-white' : ''}`}
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed)
          }}
        />
      </div> : null}

      <Link to="/" className="gx-site-logo">
        {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && width >= TAB_SIZE ?
          <img alt="lo" src={("/assets/images/w-logo.png")}/> :
          themeType === THEME_TYPE_LITE ?
            <img alt="logo1" src={("/assets/images/logo-white.png")}/> :
            <img alt="logo2" src={("/assets/images/logo.png")}/>}
      </Link>
    </div>
  );
};

export default SidebarLogo;
