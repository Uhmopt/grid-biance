import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";

const DateValueChart = ({ data = [], theme }) => {
  let options = {};
  if (data.length > 0) {
    const max = Math.max(...data?.map((item) => item?.value ?? 0));
    const min = Math.min(...data?.map((item) => item?.value ?? 0));

    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    const yPositioner = range(min, max, 0.5);

    // const seriesData = data?.map((item) => {
    //   return [item.date, item.value];
    // });

    options = {
      chart: {
        type: "areaspline",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: data?.map((item) =>
          moment.unix(item.date).format("MMM DD, YYYY HH:mm")
        ),
        labels: {
          style: {
            color: `${theme === "light" ? "#333" : "#eee"}`,
            fontSize: "14px",
          },
        },
      },
      yAxis: {
        title: {
          text: "",
        },
        tickPositioner: () => yPositioner,
        labels: {
          style: {
            color: `${theme === "light" ? "#333" : "#eee"}`,
            fontSize: "14px",
          },
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.7,
          color: `${theme === "light" ? "#7cb5ec" : "#6a6a6a"}`,
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Price",
          data: data?.map((item) => item?.value ?? 0),
        },
      ],
    };
  }

  return (
    <div className="detail-content">
      <div className="main-charts">
        <h3>For Sale</h3>
        <div>
          <HighchartsReact Highcharts={Highcharts} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DateValueChart;
