import React from 'react';
import { Line } from 'react-chartjs-2';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  chart: {
    padding: '10%',
  }
}))



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export default function PriceHistory(props) {
  const classes = useStyles()
  const data = {
    labels: props.times,
    datasets: [
      {
        label: '# of Votes',
        data: props.prices,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };
  return (
    <div className={classes.chart}>
      <h1 className='title'>Line Chart</h1>
      <Line data={data} options={options} />
    </div>
  );
}
