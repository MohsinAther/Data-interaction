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
import { QuestionCircleOutlined, DotChartOutlined } from '@ant-design/icons';
import * as am5wc from "@amcharts/amcharts5/wc";
import * as am5stock from "@amcharts/amcharts5/stock";


import { Tooltip, Button, AutoComplete, Alert, Space, message, Spin, Skeleton, Empty } from 'antd';
// import 'antd/dist/antd.css';
// const server_url = "http://localhost:3000"
const server_url = "http://51.222.106.58:3000";

var root6, wordcloud



const SamplePage = () => {
  // alert("here")
  var WC;
  var series4, stock_root;
  let companyName, companyTicker;
  var query;
  const [dataSource, setdataSource] = useState([]);
  const [resultData, setresultData] = useState([]);
  const [load, setload] = useState(false);
  const [noData, setnoData] = useState(false);
  const [showsearch, setshowsearch] = useState(false);
  let [newsArticles, setNewsArticles] = useState([]);

  const loadLineChart = (radialData) => {
    console.log(radialData.length)

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
    // root6 = am5.Root.new("chartLine");


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
    let root = am5.Root.new("chartdivstock");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      Dark.new(root)
    ]);


    // Create a stock chart
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Instantiating_the_chart
    let stockChart = root.container.children.push(am5stock.StockChart.new(root, {
    }));


    // Set global number format
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
    root.numberFormatter.set("numberFormat", "#,###.00");


    // Create a main stock panel (chart)
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels
    let mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true
    }));


    // Create value axis
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      }),
      extraMin: 0.1, // adds some space for for main series
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: "#,###.00",
      extraTooltipPrecision: 2
    }));

    let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));


    // Add series
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
      name: "MSFT",
      clustered: false,
      valueXField: "Date",
      valueYField: "Close",
      highValueYField: "High",
      lowValueYField: "Low",
      openValueYField: "Open",
      calculateAggregates: true,
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
      legendRangeValueText: ""
    }));


    // Set main value series
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
    stockChart.set("stockSeries", valueSeries);


    // Add a stock legend
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/stock-legend/
    let valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
      stockChart: stockChart
    }));


    // Create volume axis
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
      inside: true
    });

    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    let volumeValueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      numberFormat: "#.#a",
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let volumeSeries = mainPanel.series.push(am5xy.ColumnSeries.new(root, {
      name: "Volume",
      clustered: false,
      valueXField: "Date",
      valueYField: "Volume",
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
    }));

    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5
    });

    // color columns by stock rules
    volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
      let dataItem = target.dataItem;
      if (dataItem) {
        return stockChart.getVolumeColor(dataItem);
      }
      return fill;
    })


    // Set main series
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
    stockChart.set("volumeSeries", volumeSeries);
    valueLegend.data.setAll([valueSeries, volumeSeries]);


    // Add cursor(s)
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    mainPanel.set("cursor", am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!"
    }));


    // Add scrollbar
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    }));
    stockChart.toolsContainer.children.push(scrollbar);

    let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
      valueYField: "Close",
      valueXField: "Date",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis
    }));

    sbSeries.fills.template.setAll({
      visible: true,
      fillOpacity: 0.3
    });


    // Function that dynamically loads data
    async function loadData(ticker, series, granularity) {
      // debugger


      axios.get(`${server_url}/api/historic/${ticker}`).then(data => {
        data = data.data

        // Set data
        am5.array.each(series, function (item) {
          item.data.setAll(data);
        });
      })

      // success("stock prices loaded")


      // am5.net.load("http://localhost:3000/test.csv").then(function (result) {

      //   // Parse loaded data
      //   let data = am5.CSVParser.parse(result.response, {
      //     delimiter: ",",
      //     skipEmpty: true,
      //     useColumnNames: true
      //   });

      //   // Process data (convert dates and values)
      //   let processor = am5.DataProcessor.new(root, {
      //     dateFields: ["Date"],
      //     dateFormat: "yyyy-MM-dd",
      //     numericFields: ["Open", "High", "Low", "Close", "Adj Close", "Volume"]
      //   });
      //   processor.processMany(data);

      //   // Set data
      //   am5.array.each(series, function (item) {
      //     item.data.setAll(data);
      //   });
      // });
    }

    // Load initial data for the first series
    let currentGranularity = "day";
    loadData("MSFT", [valueSeries, volumeSeries, sbSeries], currentGranularity);

    // Add comparing series
    // addComparingSeries("AAPL");


    // Set up main indices selector
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/comparison-control/
    let mainSeriesControl = am5stock.DropdownListControl.new(root, {
      stockChart: stockChart,
      name: valueSeries.get("name"),
      icon: am5stock.StockIcons.getIcon("Candlestick Series"),
      fixedLabel: true,
      searchable: true,
      searchCallback: function (query) {
        let mainSeries = stockChart.get("stockSeries");
        let mainSeriesID = mainSeries ? mainSeries.get("name") : "";
        let list = getTicker(query);
        am5.array.each(list, function (item) {
          if (item.id == mainSeriesID) {
            item.disabled = true;
          }
        })
        return list;
      }
    });

    mainSeriesControl.events.on("selected", function (ev) {
      mainSeriesControl.set("name", ev.item.subLabel);
      valueSeries.set("name", ev.item.subLabel);
      loadData(ev.item.subLabel, [valueSeries, volumeSeries, sbSeries], currentGranularity);
    });


    // Set up comparison control
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/comparison-control/
    let comparisonControl = am5stock.ComparisonControl.new(root, {
      stockChart: stockChart,
      searchable: true,
      searchCallback: function (query) {
        let compared = stockChart.getPrivate("comparedSeries", []);
        let main = stockChart.get("stockSeries");
        if (compared.length > 7) {
          return [{
            label: "A maximum of 8 comparisons added",
            subLabel: "Remove some to add new ones",
            id: "",
            className: "am5stock-list-info"
          }];
        };

        let comparedIds = [];
        am5.array.each(compared, function (series) {
          comparedIds.push(series.get("name"));
        });

        let list = getTicker(query);
        am5.array.each(list, function (item) {
          if (comparedIds.indexOf(item.id) !== -1 || main.get("name") == item.id) {
            item.disabled = true;
          }
        })
        return list;
      }
    });

    comparisonControl.events.on("selected", function (ev) {
      addComparingSeries(ev.item.subLabel);
    });

    function addComparingSeries(label) {
      debugger
      let series = am5xy.LineSeries.new(root, {
        name: label,
        valueYField: "Close",
        calculateAggregates: true,
        valueXField: "Date",
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText: "{valueY.formatNumber('#.00')}"
      });
      let comparingSeries = stockChart.addComparingSeries(series);
      loadData(label, [comparingSeries], currentGranularity);
    }

    async function getTicker(search) {
      if (search == "") {
        return [];
      }
      search = search.toLowerCase();

      let resp = await axios.get(`${server_url}/api/lookup/${search}`)

      return resp.data.map(ele => {
        return { label: ele.company, subLabel: ele.ticker, id: ele._id }
      })


    }


    // Set up series type switcher
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/series-type-control/
    let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
      stockChart: stockChart
    });

    seriesSwitcher.events.on("selected", function (ev) {
      setSeriesType(ev.item.id);
    });

    function getNewSettings(series) {
      let newSettings = [];
      am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "stroke", "fill"], function (setting) {
        newSettings[setting] = series.get(setting);
      });
      return newSettings;
    }

    function setSeriesType(seriesType) {
      // Get current series and its settings
      let currentSeries = stockChart.get("stockSeries");
      let newSettings = getNewSettings(currentSeries);

      // Remove previous series
      let data = currentSeries.data.values;
      mainPanel.series.removeValue(currentSeries);

      // Create new series
      let series;
      switch (seriesType) {
        case "line":
          series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
          break;
        case "candlestick":
        case "procandlestick":
          newSettings.clustered = false;
          series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
          if (seriesType == "procandlestick") {
            series.columns.template.get("themeTags").push("pro");
          }
          break;
        case "ohlc":
          newSettings.clustered = false;
          series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
          break;
      }

      // Set new series as stockSeries
      if (series) {
        valueLegend.data.removeValue(currentSeries);
        series.data.setAll(data);
        stockChart.set("stockSeries", series);
        let cursor = mainPanel.get("cursor");
        if (cursor) {
          cursor.set("snapToSeries", [series]);
        }
        valueLegend.data.insertIndex(0, series);
      }
    }


    // Stock toolbar
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/
    let toolbar = am5stock.StockToolbar.new(root, {
      container: document.getElementById("chartcontrols"),
      stockChart: stockChart,
      controls: [
        mainSeriesControl,
        comparisonControl,
        am5stock.IndicatorControl.new(root, {
          stockChart: stockChart,
          legend: valueLegend
        }),
        // am5stock.DateRangeSelector.new(root, {
        //   stockChart: stockChart
        // }),
        am5stock.PeriodSelector.new(root, {
          stockChart: stockChart,
          periods: [
            { timeUnit: "day", count: 5, name: "5D" },
            { timeUnit: "day", count: 10, name: "10D" },
            { timeUnit: "day", count: 15, name: "15D" },
            { timeUnit: "month", count: 1, name: "1M" },
            { timeUnit: "month", count: 3, name: "3M" },
            { timeUnit: "month", count: 6, name: "6M" },
            { timeUnit: "year", count: 1, name: "1Y" },
            { timeUnit: "max", name: "Max" },
          ]
        }),
        seriesSwitcher,
        am5stock.DrawingControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.ResetControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.SettingsControl.new(root, {
          stockChart: stockChart
        })
      ]
    })

  }

  const loadWordcloud = () => {


    // wordcloud = am5.Root.new("wordcloud");
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

  useEffect(() => {
    loadStockChart()
  }, [])




  const WCAPI = async (name, ticker) => {
    console.log(name, ticker);

    setload(true)
    let queryRes = await axios.post(`${server_url}/api/wordcloud`, { query: `'${name}' OR '${ticker}'` })
    setload(false)
    debugger
    if (!queryRes || !queryRes.data || !queryRes.data.wc || !queryRes.data.sentiment_graph || !queryRes.data.sentiment_graph.length || !queryRes.data.simhash)
      return setnoData(true)

    if (queryRes) {


      // loadStockChart()

      WC = queryRes.data.wc
      setNewsArticles(queryRes.data.simhash)

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
      setnoData(false)

      if (WC.length)
        loadWordcloud();
      if (queryRes.data.sentiment_graph.length)
        loadLineChart(queryRes.data.sentiment_graph)

    }
  }


  const onSelect = (value) => {

    setshowsearch(true)
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

    let res = await axios.get(`${server_url}/api/lookup/${value}`);
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

      <div className="row px-0 mx-0 " >
        <div className="col-md-12">
          <div className="whitebox mt-0 bg-light">
            <span className="title align-baseline px-3">Stocks &nbsp;
              {/* <Tooltip placement="right" title="Shows stock prices of 1 year with advance tools to get useful insights"><QuestionCircleOutlined className="clickable" />  </Tooltip> */}
            </span>
            <div id="chartcontrols" ></div>
            <div id="chartdivstock" ></div>
          </div>
        </div>
      </div>


      <div className="row px-0 mx-0 mb-2" >
        <div className="col-md-12">
          <div className="whitebox px-0 mt-3 bg-light">

            <div className="d-flex px-4" >


              <div className="pl-2 flex-grow-1  text-center">
                <AutoComplete
                  options={dataSource}
                  style={{ width: 400 }}
                  onSelect={(e) => onSelect(e)}
                  onSearch={(e) => handleSearch(e)}
                  placeholder="Search any stock ticker or company to generate graphs"
                  className="pl-2 w-75"
                />
                {load ? <span className="ml-3"><Spin className="ml-3" /> </span> : <></>}
              </div>
              <div className="mr-auto p-2">
                <span class="badge bg-secondary bg-pos c-dark">Positive</span> &nbsp;
                <span class="badge bg-secondary bg-neg c-dark">Negative</span>&nbsp;
                <span class="badge bg-secondary bg-neut c-dark">Neutral</span>
              </div>
            </div>




          </div>

        </div>
      </div>

      {showsearch ? <>

        <div className="row px-0 mx-0 mb-2" >
          <div className="col-md-12">



            <div className="whitebox px-0 mt-3 bg-light">
              <span className="title align-baseline px-3">Sentiment Per day  &nbsp;
                {/* <Tooltip placement="right" title="Shows 30 days sentiment per day of any province if selected (whole Canada by default)"><QuestionCircleOutlined className="clickable" />  </Tooltip> */}
              </span>


              {load ?
                <div className="p-2" style={{zIndex:99999}}  ><Skeleton active={true} rows={15} style={{ width: "100% !important", height: "300px !important",zIndex:99999 }} /></div> : noData ?
                  <Empty width="100%" height="300px" /> :
                  <div id="chartLine" style={{ width: "100%", height: "300px" }} ></div>
              }
            </div>

          </div>
        </div>


        <div className="row px-0 mx-0" >


          <div className="col-md-6  pr-0 pl-0" >
            <div className="whitebox bg-light " style={{ width: "100%", height: "650px", overflowY: 'auto' }}>
              <span className="title align-baseline mb-3">Important  News  &nbsp;
                {/* <Tooltip placement="right" title="This chart shows all provinces and its cities, Province color represents the sentiment of that province and inner radial chart shows stacked sentiment of each city. 
              It contains data of last 30 days, click on any province to further analyse that city with updated word cloud and sentiment lines charts. Bottom scrollbar can be used to jump to some date.
              "><QuestionCircleOutlined className="clickable" />  </Tooltip> */}
              </span>
              {/* <Space direction="vertical" style={{ width: '100%' }}> */}

              {load ?
                <div className="p-2" ><Skeleton active={true} rows={15} style={{ width: "100% !important", height: "300px !important" }} /></div> : noData ?
                  <Empty width="100%" height="300px" /> :

                  newsArticles.length > 0 ? newsArticles.map((data1, index) => {
                    return <div className={"alert  " + (data1.doclist.docs[0].sentiment && data1.doclist.docs[0].sentiment[0] === "pos" ? 'alert-success' : data1.doclist.docs[0]?.sentiment && data1.doclist.docs[0].sentiment[0] === "neg" ? 'alert-danger' : ' alert-warning')}>
                      <div className="white mb-2"><a href={data1.doclist.docs[0].blogurl[0]} target="_black">{data1.doclist.docs[0].snippet[0]}</a></div>
                      <div> {data1.doclist.docs.length} Similar articles</div>
                      <div className="mb-2"> {moment(data1.doclist.docs[0].timestamp[0]).format('DD-MM-YYYY' +  ' at ' + 'hh:mm a')} by  {data1.doclist.docs[0].blogdesc[0]}</div>
                     
                      <div> {data1.doclist.docs[0].summary[0]}</div>

                    </div>
                  }) : null


              }
            </div>

          </div>


          <div className="col-md-6 clearfix pl-0 pr-2 ">
            <div className="whitebox bg-light ">
              <span className="title align-baseline">Word Cloud   &nbsp;
                {/* <Tooltip placement="right" title="Word Cloud shows top 30 frequent topics discussed in selected state (by default shows overall). Color represents the sentiment of that word"><QuestionCircleOutlined className="clickable" />  </Tooltip> */}
              </span>
              {load ?
                <div className="p-2" ><Skeleton active={true} rows={15} style={{ width: "100% !important", height: "600px !important" }} /></div> : noData ?
                  <Empty width="100%" height="600px" /> :
                  <div id="wordcloud" style={{ width: "100%", height: "600px" }}></div>
              }

            </div>
          </div>
        </div>
      </> : <></>}




    </div>
  );
};

export default SamplePage;


