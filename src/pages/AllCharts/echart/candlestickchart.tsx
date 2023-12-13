import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class Candlestick extends Component {
  getOption = () => {
    return {
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        zlevel: 0,
        x: 50,
        x2: 50,
        y: 30,
        y2: 30,
        borderWidth: 0,
        backgroundColor: "rgba(0,0,0,0)",
        borderColor: "rgba(0,0,0,0)",
      },
      xAxis: {
        data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
        axisLine: {
            lineStyle: {
              color: '#858d98'
            },
        },
        splitLine: {
            lineStyle: {
                color:"rgba(133, 141, 152, 0.1)"
            }
        },
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#858d98'
          },
        },
        splitLine: {
            lineStyle: {
                color:"rgba(133, 141, 152, 0.1)"
            }
        },
      },
      series: [
        {
          type: "k",
          data: [
            [20, 30, 10, 35],
            [40, 35, 30, 55],
            [33, 38, 33, 40],
            [40, 40, 32, 42],
          ],

          itemStyle: {
            normal: {
              color: "#5156be",
              color0: "#2ab57d",
              borderColor: "#5156be",
              borderColor0: "#2ab57d",
            },
          },
        },
      ],
    };
  };
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
      </React.Fragment>
    );
  }
}
export default Candlestick;
