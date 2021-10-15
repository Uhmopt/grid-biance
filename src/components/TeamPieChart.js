import React from "react";
import { Doughnut } from "react-chartjs-2";

export default function TeamPieChart({ teamOrder, loading }) {
  const data = {
    labels: teamOrder?.map((item) => item.name),
    legend: {
      display: false,
    },
    datasets: [
      {
        label: "# of Votes",
        position: "bottom",
        data: teamOrder?.map((item) => item.cellCount),
        backgroundColor: teamOrder?.map((item) => item.color),
        borderColor: teamOrder?.map((item) => item.color),
        borderWidth: 0.5,
        weight: 10,
      },
    ],
  };
  const options = [
    {
      legend: {
        display: false,
      },
    },
  ];

  return (
    <div className="custom-pie-chart">
      <Doughnut data={data} options={options} />
      {/* <span>CELL stake distribution</span> */}
    </div>
  );
}
