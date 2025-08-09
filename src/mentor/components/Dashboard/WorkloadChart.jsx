import React, { useEffect } from "react";
import * as echarts from "echarts";

const WorkloadChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("workload-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "Team Workload",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 3,
                name: "Active Teams",
                itemStyle: { color: "#4F46E5" },
              },
              {
                value: 2,
                name: "Available Slots",
                itemStyle: { color: "#E5E7EB" },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div id="workload-chart" className="w-full h-64"></div>;
};

export default WorkloadChart;
