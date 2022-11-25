import React, { useState } from "react";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import axios from 'axios'
import { Button, Col, Row } from "antd";
import moment from "moment";
import * as am5wc from "@amcharts/amcharts5/wc";
// const date_array = [
//   "Feb 17",
//   "Feb 18",
//   "Feb 19",
//   "Feb 20",
//   "Feb 21",
//   "Feb 22",
//   "Feb 23",
//   "Feb 24",
//   "Feb 25",
//   "Feb 26",
//   "Feb 27",
//   "Feb 28",
//   "Mar 01",
//   "Mar 02",
//   "Mar 03",
//   "Mar 04",
//   "Mar 05",
//   "Mar 06",
//   "Mar 07",
//   "Mar 08",
//   "Mar 09",
//   "Mar 10",
//   "Mar 11",
//   "Mar 12",
//   "Mar 13",
//   "Mar 14",
//   "Mar 15",
//   "Mar 16",
//   "Mar 17",
//   "Mar 18",
//   "Mar 19",
// ]


const date_array = []
let dates = moment().format("MMM DD")
for (var i = 0; i < 31; i++) {
  date_array.unshift(dates)
  dates = moment(dates).subtract(1, 'days').format("MMM DD")

}

const SamplePage = () => {
  var radialData, bubbleData

  const loadradialgraph = () => {

    var root = am5.Root.new("chartdiv");

    // Create custom theme
    // https://www.amcharts.com/docs/v5/concepts/themes/#Quick_custom_theme
    const myTheme = am5.Theme.new(root);

    //https://www.amcharts.com/docs/v5/concepts/themes/creating-themes/#Rules
    myTheme.rule("Label").setAll({ // fill: am5.color(0xFF0000),
      fontSize: "0.9em"
    });
    myTheme.rule("Grid").set("strokeOpacity", 0.08);


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Responsive.new(root),
      am5themes_Animated.new(root),
      myTheme
    ]);



    //#region 
    // Modify defaults

    let startYear = 0;
    let endYear = 30;
    let currentYear = 0;

    let colorSet = am5.ColorSet.new(root, {});


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      innerRadius: am5.percent(30),
      radius: am5.percent(65),
      startAngle: 270 - 170,
      endAngle: 270 + 170
    }));

    chart._settings.paddingRight = 0;
    chart._settings.paddingLeft = 0;
    chart._settings.paddingTop = 0;
    chart._settings.paddingBottom = 0;


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX",
      radius: am5.percent(40),
      innerRadius: -25
    }));
    cursor.lineY.set("visible", false);


    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    let xRenderer = am5radar.AxisRendererCircular.new(root, {
      minGridDistance: 10
    });

    xRenderer.labels.template.setAll({
      radius: 10,
      textType: "radial",
      centerY: am5.p50
    });

    let yRenderer = am5radar.AxisRendererRadial.new(root, {
      axisAngle: 90
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p50
    });

    let categoryAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "city",
      renderer: xRenderer
    }));

    let valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      // min: 0,
      // max: 10,

      renderer: yRenderer
    }));



    var positive_series = chart.series.push(
      am5radar.RadarLineSeries.new(root, {
        name: "positive",
        xAxis: categoryAxis,
        yAxis: valueAxis,
        valueYField: "value" + currentYear,
        categoryXField: "city",
        stacked: true,
        // fill:"#CCCC01",
        fill: "#8DCB35",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{city}:{valueY}"
        })
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    let negative_series = chart.series.push(am5radar.RadarLineSeries.new(root, {
      calculateAggregates: true,
      name: "negative",
      xAxis: categoryAxis,
      yAxis: valueAxis,
      valueYField: "value1" + currentYear,
      categoryXField: "city",
      fill: "#CA353C",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{city}: {valueY}"
      })
    }));

    var neutral_series = chart.series.push(
      am5radar.RadarLineSeries.new(root, {
        name: "neutral",
        xAxis: categoryAxis,
        yAxis: valueAxis,
        valueYField: "value2" + currentYear,
        categoryXField: "city",
        stacked: true,
        fill: "#CCCC01",
        // fill:"#8DCB35",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{city}:{valueY}"
        })
      })
    );


    negative_series.strokes.template.setAll({
      strokeOpacity: 0
    });

    negative_series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.5
    });



    neutral_series.strokes.template.setAll({
      strokeOpacity: 0
    });

    neutral_series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.5
    });


    positive_series.strokes.template.setAll({
      strokeOpacity: 0
    });

    positive_series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.5
    });

    // categoryAxis.itemContainers.template.events.on("pointerover", function (e) {
    //   alert(e)
    // })

    // series.columns.template.set("strokeOpacity", 0);


    // Add scrollbars
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    // chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
    // chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));

    // Add year label
    let yearLabel = chart.radarContainer.children.push(am5.Label.new(root, {
      fontSize: "2em",
      text: date_array[currentYear],
      centerX: am5.p50,
      centerY: am5.p50,
      fill: am5.color(0x673AB7)
    }));


    // Generate and set data
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
    let data = generateRadarData();
    negative_series.data.setAll(data);
    neutral_series.data.setAll(data);
    positive_series.data.setAll(data);
    categoryAxis.data.setAll(data);

    negative_series.appear(3000);
    neutral_series.appear(3000);
    positive_series.appear(3000);
    chart.appear(1000, 100);


    //#endregion
    function generateRadarData() {
      debugger
      let data = [];
      let i = 0;
      radialData.forEach(item => {
        let province = item.province;

        for (const [key, value] of Object.entries(item.cities)) {
          let rawDataItem = { "city": key }
          for (var y = 2; y < value.length; y++) {
            rawDataItem["value" + (startYear + y - 2)] = item.cities[key][y].pos;
            rawDataItem["value1" + (startYear + y - 2)] = item.cities[key][y].neg;
            rawDataItem["value2" + (startYear + y - 2)] = item.cities[key][y].neut;
          }

          data.push(rawDataItem);
        }


        createRange(province, item.cities, i, item.color);
        i++;
      })

      return data;
    }

    // generateRadarData()


    function createRange(name, continentData, index, color) {
      let axisRange = categoryAxis.createAxisRange(categoryAxis.makeDataItem({ above: true }));
      axisRange.get("label").setAll({ text: name });
      // first s name
      axisRange.set("category", Object.keys(continentData)[0]);
      // last city
      axisRange.set("endCategory", Object.keys(continentData)[Object.keys(continentData).length - 1]);

      // every 3rd color for a bigger contrast
      let fill = axisRange.get("axisFill");
      fill.setAll({
        toggleKey: "active",
        cursorOverStyle: "pointer",
        fill: color,
        visible: true,
        innerRadius: -25
      });
      axisRange.get("grid").set("visible", false);

      let label = axisRange.get("label");
      label.setAll({
        fill: am5.color(0xffffff),
        textType: "circular",
        radius: -16
      });

      fill.events.on("click", function (event) {
        debugger

        let dataItem = event.target.dataItem;
        let x = event.target.get("label")
        let y = dataItem.get("label")
        if (event.target.get("active")) {
          categoryAxis.zoom(0, 1);
        }
        else {
          categoryAxis.zoomToCategories(dataItem.get("category"), dataItem.get("endCategory"));
        }
      });
    }


    // Create controls
    let container = chart.children.push(am5.Container.new(root, {
      y: am5.percent(95),
      centerX: am5.p50,
      x: am5.p50,
      width: am5.percent(80),
      layout: root.horizontalLayout
    }));

    let playButton = container.children.push(am5.Button.new(root, {
      themeTags: ["play"],
      centerY: am5.p50,
      marginRight: 15,
      icon: am5.Graphics.new(root, {
        themeTags: ["icon"]
      })
    }));

    playButton.events.on("click", function () {
      if (playButton.get("active")) {
        slider.set("start", slider.get("start") + 0.0001);
      }
      else {
        slider.animate({
          key: "start",
          to: 1,
          duration: 15000 * (1 - slider.get("start"))
        });
      }
    })

    let slider = container.children.push(am5.Slider.new(root, {
      orientation: "horizontal",
      start: 0,
      centerY: am5.p50
    }));

    slider.on("start", function (start) {
      if (start === 1) {
        playButton.set("active", false);
      }
    });

    slider.events.on("rangechanged", function () {
      updateRadarData(startYear + Math.round(slider.get("start", 0) * (endYear - startYear)));
    });

    function updateRadarData(year) {
      if (currentYear != year) {
        currentYear = year;
        // yearLabel.set("text", currentYear.toString());
        yearLabel.set("text", date_array[currentYear]);
        am5.array.each(positive_series.dataItems, function (dataItem) {

          let newValue = dataItem.dataContext["value" + year];
          dataItem.set("value", newValue);
          dataItem.animate({ key: "valueYWorking", to: newValue, duration: 500 });
        });

        am5.array.each(negative_series.dataItems, function (dataItem) {

          let newValue = dataItem.dataContext["value1" + year];
          dataItem.set("value2", newValue);
          dataItem.animate({ key: "valueYWorking", to: newValue, duration: 500 });
        });

        am5.array.each(neutral_series.dataItems, function (dataItem) {

          let newValue = dataItem.dataContext["value2" + year];
          dataItem.set("value2", newValue);
          dataItem.animate({ key: "valueYWorking", to: newValue, duration: 500 });
        });
      }
    }

  }

  const loadCollapsibleGraph = () => {

    // Create root element
    var root = am5.Root.new("chartdivbubble");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    var data = {
      value: 0,
      children: [
        {
          name: "Flora",
          children: [
            {
              name: "Black Tea",
              value: 1
            },
            {
              name: "Floral",
              children: [
                {
                  name: "Chamomile",
                  value: 1
                },
                {
                  name: "Rose",
                  value: 1
                },
                {
                  name: "Jasmine",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Ontario",
          children: [
            {
              name: "Ottawa",
              children: [
                {
                  name: "AMENDMENT BYLAW",
                  value: 3
                },
                {
                  name: "Accessibility Improvements",
                  value: 4
                },
                {
                  name: "Achievements",
                  value: 1
                },
                {
                  name: "Adirondack",
                  value: 1
                }
              ]
            },
            {
              name: "Dried Fruit",
              children: [
                {
                  name: "Raisin",
                  value: 1
                },
                {
                  name: "Prune",
                  value: 1
                }
              ]
            },
            {
              name: "Other Fruit",
              children: [
                {
                  name: "Coconut",
                  value: 1
                },
                {
                  name: "Cherry",
                  value: 1
                },
                {
                  name: "Pomegranate",
                  value: 1
                },
                {
                  name: "Pineapple",
                  value: 1
                },
                {
                  name: "Grape",
                  value: 1
                },
                {
                  name: "Apple",
                  value: 1
                },
                {
                  name: "Peach",
                  value: 1
                },
                {
                  name: "Pear",
                  value: 1
                }
              ]
            },
            {
              name: "Citrus Fruit",
              children: [
                {
                  name: "Grapefruit",
                  value: 1
                },
                {
                  name: "Orange",
                  value: 1
                },
                {
                  name: "Lemon",
                  value: 1
                },
                {
                  name: "Lime",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Sour/Fermented",
          children: [
            {
              name: "Sour",
              children: [
                {
                  name: "Sour Aromatics",
                  value: 1
                },
                {
                  name: "Acetic Acid",
                  value: 1
                },
                {
                  name: "Butyric Acid",
                  value: 1
                },
                {
                  name: "Isovaleric Acid",
                  value: 1
                },
                {
                  name: "Citric Acid",
                  value: 1
                },
                {
                  name: "Malic Acid",
                  value: 1
                }
              ]
            },
            {
              name: "Alcohol/Fremented",
              children: [
                {
                  name: "Winey",
                  value: 1
                },
                {
                  name: "Whiskey",
                  value: 1
                },
                {
                  name: "Fremented",
                  value: 1
                },
                {
                  name: "Overripe",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Green/Vegetative",
          children: [
            {
              name: "Olive Oil",
              value: 1
            },
            {
              name: "Raw",
              value: 1
            },
            {
              name: "Green/Vegetative",
              children: [
                {
                  name: "Under-ripe",
                  value: 1
                },
                {
                  name: "Peapod",
                  value: 1
                },
                {
                  name: "Fresh",
                  value: 1
                },
                {
                  name: "Dark Green",
                  value: 1
                },
                {
                  name: "Vegetative",
                  value: 1
                },
                {
                  name: "Hay-like",
                  value: 1
                },
                {
                  name: "Herb-like",
                  value: 1
                }
              ]
            },
            {
              name: "Beany",
              value: 1
            }
          ]
        },
        {
          name: "Other",
          children: [
            {
              name: "Papery/Musty",
              children: [
                {
                  name: "Stale",
                  value: 1
                },
                {
                  name: "Cardboard",
                  value: 1
                },
                {
                  name: "Papery",
                  value: 1
                },
                {
                  name: "Woody",
                  value: 1
                },
                {
                  name: "Moldy/Damp",
                  value: 1
                },
                {
                  name: "Musty/Dusty",
                  value: 1
                },
                {
                  name: "Musty/Earthy",
                  value: 1
                },
                {
                  name: "Animalic",
                  value: 1
                },
                {
                  name: "Meaty Brothy",
                  value: 1
                },
                {
                  name: "Phenolic",
                  value: 1
                }
              ]
            },
            {
              name: "Chemical",
              children: [
                {
                  name: "Bitter",
                  value: 1
                },
                {
                  name: "Salty",
                  value: 1
                },
                {
                  name: "Medicinal",
                  value: 1
                },
                {
                  name: "Petroleum",
                  value: 1
                },
                {
                  name: "Skunky",
                  value: 1
                },
                {
                  name: "Rubber",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Roasted",
          children: [
            {
              name: "Pipe Tobacco",
              value: 1
            },
            {
              name: "Tobacco",
              value: 1
            },
            {
              name: "Burnt",
              children: [
                {
                  name: "Acrid",
                  value: 1
                },
                {
                  name: "Ashy",
                  value: 1
                },
                {
                  name: "Smoky",
                  value: 1
                },
                {
                  name: "Brown, Roast",
                  value: 1
                }
              ]
            },
            {
              name: "Cereal",
              children: [
                {
                  name: "Grain",
                  value: 1
                },
                {
                  name: "Malt",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Spices",
          children: [
            {
              name: "Pungent",
              value: 1
            },
            {
              name: "Pepper",
              value: 1
            },
            {
              name: "Brown Spice",
              children: [
                {
                  name: "Anise",
                  value: 1
                },
                {
                  name: "Nutmeg",
                  value: 1
                },
                {
                  name: "Cinnamon",
                  value: 1
                },
                {
                  name: "Clove",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Nutty/Cocoa",
          children: [
            {
              name: "Nutty",
              children: [
                {
                  name: "Peanuts",
                  value: 1
                },
                {
                  name: "Hazelnut",
                  value: 1
                },
                {
                  name: "Almond",
                  value: 1
                }
              ]
            },
            {
              name: "Cocoa",
              children: [
                {
                  name: "Chocolate",
                  value: 1
                },
                {
                  name: "Dark Chocolate",
                  value: 1
                }
              ]
            }
          ]
        },
        {
          name: "Sweet",
          children: [
            {
              name: "Brown Sugar",
              children: [
                {
                  name: "Molasses",
                  value: 1
                },
                {
                  name: "Maple Syrup",
                  value: 1
                },
                {
                  name: "Caramelized",
                  value: 1
                },
                {
                  name: "Honey",
                  value: 1
                }
              ]
            },
            {
              name: "Vanilla",
              value: 1
            },
            {
              name: "Vanillin",
              value: 1
            },
            {
              name: "Overall Sweet",
              value: 1
            },
            {
              name: "Sweet Aromatics",
              value: 1
            }
          ]
        }
      ]
    };

    // Create wrapper container
    var container = root.container.children.push(am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.horizontalLayout
    }));

    // Create series
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    var series = container.children.push(am5hierarchy.ForceDirected.new(root, {
      singleBranchOnly: false,
      downDepth: 1,
      topDepth: 1,
      initialDepth: 0,
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      idField: "name",
      linkWithField: "linkWith",
      manyBodyStrength: -10,
      centerStrength: 0.8
    }));

    // series.get("colors").setAll({
    //   step: 2
    // });

    // series.circles.template.setAll({
    //   fillOpacity: 0.7,
    //   strokeWidth: 1,
    //   strokeOpacity: 1
    // });

    series.links.template.set("strength", 0.5);

    series.data.setAll([bubbleData]);

    series.set("selectedDataItem", series.dataItems[0]);


    // Make stuff animate on load
    series.appear(1000, 100);

  }
  var series4

  let wordcloud = am5.Root.new("wordcloud");
  wordcloud.setThemes([
    am5themes_Animated.new(wordcloud)
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

  // generateWCData()



  // const generateWCData = () => {
  //   var pushthis = [{ tag: "Mohsinssss", weight: 20, fill: "#c3c301" }, { tag: "Ather", weight: 10, fill: "#c3c301" }]
  //   series4.data.setAll(
  //     pushthis
  //   );
  // }



  axios.get('http://localhost:5000/findings').then(res => {
    radialData = res.data
    loadradialgraph()

  })
    .catch(function (error) {
      console.log(error)
    })

  axios.get('http://localhost:5000/topics').then(res => {
    bubbleData = {
      value: 0,
      children: res.data
    }
    loadCollapsibleGraph()
    // loadWordcloud()

  })
    .catch(function (error) {
      console.log(error)
    })


  axios.get('http://localhost:5000/wc').then(res => {

    series4.data.setAll(
      res.data
    );
   // loadWordcloud()

  })
    .catch(function (error) {
      console.log(error)
    })






  return (
    <div>
      <Row>
        <Col span={17} className="whitebox"><div id="chartdiv" style={{ width: "100%", height: "600px" }} ></div></Col>
        <Col span={7} className="whitebox"><div id="wordcloud" style={{ width: "100%", height: "800px" }}></div></Col>
      </Row>

      <Row>
        <Col span={24} className="whitebox mt-3"><div id="chartdivbubble" style={{ width: "100%", height: "600px" }} ></div></Col>
      </Row>
    </div>
  );
};

export default SamplePage;
