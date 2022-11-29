import React, { useState } from "react";
import { Layout, Select } from "antd";

import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData";
import { switchLanguage } from "../../appRedux/actions";
import SearchBox from "../../components/SearchBox";
import { NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE } from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Button, AutoComplete } from 'antd';


const { Option } = Select;
const { Header } = Layout;

const Topbar = () => {

  const { locale, navStyle } = useSelector(({ settings }) => settings);
  const navCollapsed = useSelector(({ common }) => common.navCollapsed);
  const width = useSelector(({ common }) => common.width);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  /**
   * Lookup API
   */
  function onSelect(value) {
    console.log('onSelect', value);
  }
  const [dataSource, setdataSource] = useState([]);

  // state = {
  //   dataSource: [],
  // }

  const handleSearch = (value) => {
    setdataSource({
      dataSource: !value ? [] : [
        value,
        value + value,
        value + value + value,
      ],
    });
  }

  /**
   * Lookup API complete
   */


  return (
    <></>
    // <Header className="bg-light">
    //   {/* <img className="logo" src="https://www.seekpng.com/png/full/841-8412607_universal-music-group-logo-logo-carleton-university.png"></img> */}
    //   {/* <AutoComplete
    //     dataSource={dataSource}
    //     style={{ width: 200 }}
    //     onSelect={onSelect}
    //     onSearch={()=>handleSearch()}
    //     placeholder="input here"
    //   /> */}
    //   {/* this is top bar */}

   

    // </Header>
  );
};

export default Topbar;
