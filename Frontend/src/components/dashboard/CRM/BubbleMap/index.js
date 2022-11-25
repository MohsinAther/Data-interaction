import React from "react";
import {ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from "react-simple-maps";
import {scaleLinear} from "d3-scale";
import cities from "./static/world-most-populous-cities.json";
import geographyData from "./static/world-50m.json";

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
};

const cityScale = scaleLinear()
  .domain([0, 37843000])
  .range([1, 25]);

const BubbleMap = () => {

  return (
    <div style={wrapperStyles}>
      <ComposableMap
        projectionConfig={{scale: 180}}
        width={980}
        height={450}
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <ZoomableGroup center={[0, 20]}>
          <Geographies geography={geographyData}>
            {({ geographies }) =>
              geographies.map((geo, i) => (
                <Geography
                  key={i}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))}
          </Geographies>
          {
            cities.map((city, i) => (
              <Marker key={i} coordinates={city.coordinates}>
                <circle
                  cx={0}
                  cy={0}
                  r={cityScale(city.population)}
                  fill="rgba(255,87,34,0.8)"
                  stroke="#607D8B"
                  strokeWidth="2"
                />
              </Marker>
            ))
          }
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
};

export default BubbleMap;
