import React, { useEffect, useState } from "react";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Dark from "@amcharts/amcharts5/themes/Dark";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import axios from 'axios';
import moment from "moment";
import { QuestionCircleOutlined } from '@ant-design/icons';
import * as am5wc from "@amcharts/amcharts5/wc";
// import * as am5stock from "@amcharts/amcharts5/stock";

import { Tooltip, Button, AutoComplete, Alert, Space } from 'antd';
// import 'antd/dist/antd.css';
const server_url = "http://localhost:3000"

/**
 * Lookup API
 */
function onSelect(value) {
  console.log('onSelect', value);
}


const SamplePage = () => {

  var WC;
  let series4, wordcloud, root6, stock_root;
  var query;
  const [dataSource, setdataSource] = useState([]);
  const [resultData, setresultData] = useState([]);
  const [load, setload] = useState(false);
  let [newsArticles, setNewsArticles] = useState([]);





  const loadLineChart = (radialData) => {
    console.log(radialData.length)

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element 


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/ 
    root6.setThemes([
      am5themes_Animated.new(root6),
      Dark.new(root6)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root6.container.children.push(am5xy.XYChart.new(root6, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0,
      pinchZoomX: true
    }));


    var date = new Date();
    date.setHours(0, 0, 0, 0);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root6, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root6, {}),
      tooltip: am5.Tooltip.new(root6, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root6, {
      renderer: am5xy.AxisRendererY.new(root6, {})
    }));

    let arrayofsenti = [
      {
        name: "positive"
      },
      {
        name: "negative"
      },
      {
        name: "neutral"
      }
    ]


    let postiveData = [];
    let negativeData = [];
    let neutralData = [];

    let provinceData;
    // if (radialData) {
    //   radialData.forEach((item, cityIndex) => {


    //     if (item.province === province) {
    //       provinceData = item
    //     }

    //   })
    // }


    // let test_date= moment().subtract(30, "day")

    radialData.forEach((data, dataIndex) => {
      let specificDatePos = 0, specificDateNeg = 0, specificDateNeu = 0;

      let date = new Date(data.value);
      // let date = new Date(test_date);
      // test_date.add(1,'day')


      date.setHours(0, 0, 0, 0);
      data.pivot.forEach(ele => {
        if (ele.value === "pos")
          specificDatePos = ele.count;
        else if (ele.value === "neg")
          specificDateNeg = ele.count
        else if (ele.value === "neut")
          specificDateNeu = ele.count
      })

      postiveData.push({ date: date.getTime(), value: specificDatePos })
      negativeData.push({ date: date.getTime(), value: specificDateNeg })
      neutralData.push({ date: date.getTime(), value: specificDateNeu })
    })

    postiveData.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    negativeData.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    neutralData.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    for (var i = 0; i < 3; i++) {
      var series = chart.series.push(am5xy.LineSeries.new(root6, {
        name: arrayofsenti[i].name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root6, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}"
        })
      }));



      // var data = generateDatas(100);

      // series.data.setAll(data);
      if (i === 0) {
        series.data.setAll(postiveData);
        series.set("stroke", am5.color("#00ff00"));
      }
      if (i === 1) {
        series.data.setAll(negativeData);
        series.set("stroke", am5.color("#FF0000"));
      }
      if (i === 2) {
        series.data.setAll(neutralData);
        series.set("stroke", am5.color("#CCCC00"));
      }

      series.appear();
    }


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root6, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);


    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root6, {
      orientation: "horizontal"
    }));

    // chart.set("scrollbarY", am5.Scrollbar.new(root6, {
    //   orientation: "vertical"
    // }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.rightAxesContainer.children.push(am5.Legend.new(root6, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100)
    }));

    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function (e) {
      var itemContainer = e.target;

      // As series list is data of a legend, dataContext is series
      var series = itemContainer.dataItem.dataContext;

      chart.series.each(function (chartSeries) {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.15,
            // stroke: am5.color(0x000000)
          });
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3
          });
        }
      })
    })

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function (e) {
      var itemContainer = e.target;
      var series = itemContainer.dataItem.dataContext;

      chart.series.each(function (chartSeries) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 1,
          // stroke: chartSeries.get("fill")
        });
      });
    })

    legend.itemContainers.template.set("width", am5.p100);
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right"
    });

    // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
    legend.data.setAll(chart.series.values);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  }

  const loadStockChart = () => {
    // stock_root = am5.Root.new("chartdivstock");
    // stock_root.setThemes([
    //   am5themes_Animated.new(stock_root),
    //   Dark.new(stock_root)
    // ]);

    // let stockChart = stock_root.container.children.push(am5stock.StockChart.new(stock_root, {
    // }));



  }

  const loadWordcloud = () => {


    wordcloud.setThemes([
      am5themes_Animated.new(wordcloud),
      Dark.new(wordcloud)
    ]);

    series4 = wordcloud.container.children.push(am5wc.WordCloud.new(wordcloud, {
      // colors: wordcloud.ColorSet.new(wordcloud, {}),
      categoryField: "tag",
      valueField: "weight",
      maxFontSize: am5.percent(20),
      minFontSize: am5.percent(5),
    }));


    series4.labels.template.setAll({
      // fontFamily: "Raleway",
      templateField: "labelSettings"
    });

    generateWCData()

  }

  const generateWCData = () => {
    // var pushthis = [{ tag: "Mohsinssss", weight: 20, fill: "#c3c301" }, { tag: "Ather", weight: 10, fill: "#c3c301" }]
    series4.data.setAll(
      WC
    );
  }




  let companyName, companyTicker;


  const WCAPI = async (name, ticker) => {
    console.log(name, ticker);


    let queryRes = await axios.post(`${server_url}/api/wordcloud`, { query: `'${name}' OR '${ticker}'` })

    if (queryRes) {

      WC = queryRes.data.wc
      setNewsArticles(queryRes.data.simhash)
      debugger
      if (root6) {
        root6.dispose()
        root6 = am5.Root.new("chartLine");

      }
      else {
        root6 = am5.Root.new("chartLine");

      }

      if (wordcloud) {
        wordcloud.dispose()
        wordcloud = am5.Root.new("wordcloud");

      }
      else {
        wordcloud = am5.Root.new("wordcloud");

      }


      loadWordcloud();
      loadLineChart(queryRes.data.sentiment_graph)

    }
  }

  // useEffect(() => {
  //   WCAPI()
  // }, [])


  const onSelect = (value) => {

    let searchId;
    dataSource.find((data, index) => {
      if (data.value === value) {
        searchId = data.id
      }
    })

    resultData.find((data, index) => {
      if (data._id === searchId) {
        companyName = data.company;
        companyTicker = data.ticker
      }
    })

    WCAPI(companyName, companyTicker)

  }

  // state = {
  //   dataSource: [],
  // }

  const handleSearch = async (value) => {

    let res = await axios.get(`http://localhost:3000/api/lookup/${value}`);
    setresultData(res.data)

    let serachRes = []
    res && res.data && res.data.forEach((data, index) => {
      serachRes.push({ value: `${data.company}  ${data.ticker} `, id: data._id })
    })
    setdataSource(
      serachRes
    )

  }

  return (
    <div className="background-dark ">

      <div style={{ width: '100%', textAlign: "center" }}>
        <AutoComplete
          options={dataSource}
          style={{ width: 400 }}
          onSelect={(e) => onSelect(e)}
          onSearch={(e) => handleSearch(e)}
          placeholder="input here"
        />
      </div>
      <div className="row px-0 mx-0 " >
        <div className="col-md-12">
          <div className="whitebox mt-3 bg-light">
            <span className="title align-baseline px-3">Stocks &nbsp;
              <Tooltip placement="right" title="Represents topics by provinces and cities, Size represents unique topics, Each node at city level shows topic and its frequency"><QuestionCircleOutlined className="clickable" />  </Tooltip>
            </span>

            <div id="chartdivstock" style={{ width: "100%", height: "500px" }} ></div>
          </div>
        </div>
      </div>


      <div className="row px-0 mx-0 mb-2" >
        <div className="col-md-12">
          <div className="whitebox px-0 mt-3 bg-light">
            <span className="title align-baseline px-3">Sentiment Per day  &nbsp;
              <Tooltip placement="right" title="Shows 30 days sentiment per day of any province if selected (whole Canada by default)"><QuestionCircleOutlined className="clickable" />  </Tooltip>
            </span>

            <div id="chartLine" style={{ width: "100%", height: "200px" }} ></div>
          </div>
        </div>
      </div>

      <div className="row px-0 mx-0" >


        <div className="col-md-6  pr-0 pl-0" >
          <div className="whitebox bg-light ">
            <span className="title align-baseline">Latest News  &nbsp;
              <Tooltip placement="right" title="This chart shows all provinces and its cities, Province color represents the sentiment of that province and inner radial chart shows stacked sentiment of each city. 
              It contains data of last 30 days, click on any province to further analyse that city with updated word cloud and sentiment lines charts. Bottom scrollbar can be used to jump to some date.
              "><QuestionCircleOutlined className="clickable" />  </Tooltip>
            </span>
            {/* <Space direction="vertical" style={{ width: '100%' }}> */}

              {
                newsArticles.length > 0 ? newsArticles.map((data1,index)=>{
                  return <div className={ "alert  " + (data1.doclist.docs[0].sentiment[0] ==="pos" ? 'alert-success' : data1.doclist.docs[0].sentiment[0] ==="neg" ? 'alert-danger':' alert-warning') }>
                  <div className="white"><a href={data1.doclist.docs[0].blogurl[0]} target="_black">{data1.doclist.docs[0].snippet[0]}</a></div><br />
                  <div> {data1.doclist.docs.length} Similar articles</div>
                  <div> {data1.doclist.docs[0].timestamp[0]}</div>
                  <div> {data1.doclist.docs[0].blogdesc[0]}</div>
                  <div> {data1.doclist.docs[0].summary[0]}</div>

                  </div>
                })  : null

                
            }
          </div>

        </div>


        <div className="col-md-6 clearfix pl-0 pr-2 ">
          <div className="whitebox bg-light ">
            <span className="title align-baseline">Word Cloud   &nbsp;
              <Tooltip placement="right" title="Word Cloud shows top 30 frequent topics discussed in selected state (by default shows overall). Color represents the sentiment of that word"><QuestionCircleOutlined className="clickable" />  </Tooltip>
            </span>

            <div id="wordcloud" style={{ width: "100%", height: "600px" }}></div>
          </div>
        </div>
      </div>





    </div>
  );
};

export default SamplePage;



