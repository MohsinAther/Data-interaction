import React, {useState} from "react";
import {Button, Drawer, Form, Radio, Switch} from "antd";
import {useDispatch, useSelector} from "react-redux";
import CustomScrollbars from "util/CustomScrollbars";
import {onLayoutTypeChange, setThemeType} from "appRedux/actions/Setting";

import {
  ACTIVE_COLOR_OPTION,
  BLUE,
  BLUE_SEC,
  DARK_BLUE,
  DARK_BLUE_SEC,
  DEEP_ORANGE,
  DEEP_ORANGE_SEC,
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  LIGHT_BLUE,
  LIGHT_BLUE_SEC,
  LIGHT_PURPLE,
  LIGHT_PURPLE_1,
  LIGHT_PURPLE_1_SEC,
  LIGHT_PURPLE_2,
  LIGHT_PURPLE_2_SEC,
  LIGHT_PURPLE_SEC,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  ORANGE,
  ORANGE_SEC,
  RED,
  RED_SEC,
  THEME_TYPE_DARK,
  THEME_TYPE_LITE,
  THEME_TYPE_SEMI_DARK
} from "../constants/ThemeSetting";
import {onNavStyleChange, setDirectionRTL, setThemeColor} from "../appRedux/actions";

const CustomizerSystem = () => {

  const [isCustomizerOpened, setIsCustomizerOpened] = useState(false);
  const {themeType, themeColor, navStyle, layoutType, isDirectionRTL} = useSelector(({settings}) => settings);
  const dispatch = useDispatch();

  const handleColorChange = (filename) => {
    dispatch(setThemeColor(filename));
  };

  const toggleCustomizer = () => {
    setIsCustomizerOpened(!isCustomizerOpened);
  };

  const onThemeTypeChange = (e) => {
    dispatch(setThemeType(e.target.value));
  };

  const onNavStyleChanges = (navStyle) => {
    dispatch(onNavStyleChange(navStyle));
  };

  const getCustomizerContent = () => {
    return <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item">
        <h6 className="gx-mb-3 gx-text-uppercase">Theme</h6>
        <Radio.Group value={themeType} onChange={onThemeTypeChange}>
          <Radio.Button value={THEME_TYPE_LITE}>Lite</Radio.Button>
          <Radio.Button value={THEME_TYPE_SEMI_DARK}>Semi Dark</Radio.Button>
          <Radio.Button value={THEME_TYPE_DARK}>Dark</Radio.Button>
        </Radio.Group>
      </div>
      {themeType !== THEME_TYPE_DARK && <div className="gx-customizer-item">
        {getPresetColors(themeColor)}
      </div>
      }

      <h6 className="gx-mb-3 gx-text-uppercase">Nav Style</h6>

      {getNavStyles(navStyle)}

      <h6 className="gx-mb-3 gx-text-uppercase">Layout</h6>

      {getLayoutsTypes(layoutType)}

      <div className="gx-customizer-item">
        <h6 className="gx-mb-3 gx-text-uppercase">Other Settings</h6>

        <Form.Item label="Layout Orientation (RTL)" className={isDirectionRTL ? 'gx-mr-0' : 'gx-ml-0'}>
          <Switch className="gx-ml-2" checked={isDirectionRTL} onChange={onChangeDirection}/>
        </Form.Item>
      </div>
    </CustomScrollbars>
  };

  function onChangeDirection(checked) {
    dispatch(setDirectionRTL(checked));
  }

  const handleThemeColor = (fileName) => {
    handleColorChange(fileName);
  };

  const handleLayoutTypes = (layoutType) => {
    dispatch(onLayoutTypeChange(layoutType));
  };

  const getPresetColors = (themeColor) => {
    return <ul className="gx-color-option gx-list-inline">
      <li>
      <span
        onClick={() => handleThemeColor("light_purple")}
        style={{backgroundColor: LIGHT_PURPLE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-light-purple ${themeColor === LIGHT_PURPLE && 'active'}`}/>
      </li>
      <li>
      <span
        onClick={() => handleThemeColor("red")}
        style={{backgroundColor: RED_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-red ${themeColor === RED && 'active'}`}/>
      </li>
      <li>
      <span
        onClick={() => handleThemeColor("blue")}
        style={{backgroundColor: BLUE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-blue ${themeColor === BLUE && 'active'}`}/>
      </li>
      <li>
      <span
        onClick={() => handleThemeColor("dark_blue")}
        style={{backgroundColor: DARK_BLUE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-dark-blue ${themeColor === DARK_BLUE && 'active'}`}/>
      </li>

      <li>
      <span
        onClick={() => handleThemeColor("orange")}
        style={{backgroundColor: ORANGE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-orange ${themeColor === ORANGE && 'active'}`}/>
      </li>

      <li>
      <span
        onClick={() => handleThemeColor("light_blue")}
        style={{backgroundColor: LIGHT_BLUE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-light-blue ${themeColor === LIGHT_BLUE && 'active'}`}/>
      </li>

      <li>
      <span
        onClick={() => handleThemeColor("deep_orange")}
        style={{backgroundColor: DEEP_ORANGE_SEC, color: ACTIVE_COLOR_OPTION}}
        className={`gx-link gx-color-deep-orange ${themeColor === DEEP_ORANGE && 'active'}`}/>
      </li>

      <li>
      <span
        onClick={() => handleThemeColor("light_purple_1")}
        style={{
          backgroundColor: LIGHT_PURPLE_1_SEC,
          color: ACTIVE_COLOR_OPTION
        }}
        className={`gx-link gx-color-light-purple1 ${themeColor === LIGHT_PURPLE_1 && 'active'}`}/>
      </li>

      <li>
      <span
        onClick={() => handleThemeColor("light_purple_2")}
        style={{
          backgroundColor: LIGHT_PURPLE_2_SEC,
          color: ACTIVE_COLOR_OPTION
        }}
        className={`gx-link gx-color-light-purple2 ${themeColor === LIGHT_PURPLE_2 && 'active'}`}/>
      </li>
    </ul>
  };

  const getLayoutsTypes = (layoutType) => {
    return <ul className="gx-layout-option gx-list-inline">
      <li>
      <span onClick={() => handleLayoutTypes(LAYOUT_TYPE_FRAMED)}
            className={`gx-pointer ${layoutType === LAYOUT_TYPE_FRAMED && 'active'}`}>
      <img src={'/assets/images/layouts/framed.png'} alt='framed'/>
      </span>
      </li>
      <li>
      <span onClick={() => handleLayoutTypes(LAYOUT_TYPE_FULL)}
            className={`gx-pointer ${layoutType === LAYOUT_TYPE_FULL && 'active'}`}>
      <img src={'/assets/images/layouts/full width.png'} alt='full width'/>
      </span>
      </li>
      <li>
      <span onClick={() => handleLayoutTypes(LAYOUT_TYPE_BOXED)}
            className={`gx-pointer ${layoutType === LAYOUT_TYPE_BOXED && 'active'}`}>
      <img src={'/assets/images/layouts/boxed.png'} alt='boxed'/>
      </span>
      </li>
    </ul>
  };

  const getNavStyles = (navStyle) => {
    return <ul className="gx-nav-option gx-list-inline">
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_FIXED)}
            className={`gx-pointer ${navStyle === NAV_STYLE_FIXED && 'active'}`}>
      <img src={'/assets/images/layouts/fixed.png'} alt='fixed'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_MINI_SIDEBAR)}
            className={`gx-pointer ${navStyle === NAV_STYLE_MINI_SIDEBAR && 'active'}`}>
      <img src={'/assets/images/layouts/mini sidebar.png'} alt='mini sidebar'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_DRAWER)}
            className={`gx-pointer ${navStyle === NAV_STYLE_DRAWER && 'active'}`}>
      <img src={'/assets/images/layouts/drawer nav.png'} alt='drawer nav'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_NO_HEADER_MINI_SIDEBAR)}
            className={`gx-pointer ${navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && 'active'}`}>
      <img src={'/assets/images/layouts/no header mini sidebar.png'} alt='no hader mini sidebar'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR)}
            className={`gx-pointer ${navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR && 'active'}`}>
      <img src={'/assets/images/layouts/vertical no header.png'} alt='vertical no header'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_DEFAULT_HORIZONTAL)}
            className={`gx-pointer ${navStyle === NAV_STYLE_DEFAULT_HORIZONTAL && 'active'}`}>
      <img src={'/assets/images/layouts/default horizontal.png'} alt='default horizontal'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_DARK_HORIZONTAL)}
            className={`gx-pointer ${navStyle === NAV_STYLE_DARK_HORIZONTAL && 'active'}`}>
      <img src={'/assets/images/layouts/dark horizontal.png'} alt='dark horizontal'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_INSIDE_HEADER_HORIZONTAL)}
            className={`gx-pointer ${navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL && 'active'}`}>
      <img src={'/assets/images/layouts/inside header horizontal.png'} alt='inside header horizontal'/>
      </span>
      </li>
      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_BELOW_HEADER)}
            className={`gx-pointer ${navStyle === NAV_STYLE_BELOW_HEADER && 'active'}`}>
      <img src={'/assets/images/layouts/below header.png'} alt='below header'/>
      </span>
      </li>

      <li>
      <span onClick={() => onNavStyleChanges(NAV_STYLE_ABOVE_HEADER)}
            className={`gx-pointer ${navStyle === NAV_STYLE_ABOVE_HEADER && 'active'}`}>
      <img src={'/assets/images/layouts/top to header.png'} alt='top to header'/>
      </span>
      </li>
    </ul>
  };

  return (
    <>
      <Drawer
        placement="right"
        closable={false}
        onClose={toggleCustomizer}
        visible={isCustomizerOpened}>
        {
          getCustomizerContent()
        }
      </Drawer>
      <div className="gx-customizer-option">
        <Button type="primary" onClick={toggleCustomizer}>
          <i className="icon icon-setting fxicon-hc-spin gx-d-block"/>
        </Button>
      </div>
    </>
  );
};

export default CustomizerSystem;
