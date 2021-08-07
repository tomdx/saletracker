import React from 'react';
import { Chart } from 'react-google-charts'
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  chart: {
    padding: '5%',
  }
}))



export default function PriceHistory(props) {
  const classes = useStyles()
  let data = [
    [
      { type: 'date', label: 'Day' },
      '',
    ],
  ]
  for (let i = 0; i < props.prices.length; i++) {
    let entry = [new Date(parseInt(props.times[i]) * 1000), parseFloat(props.prices[i])]
    data.push(entry)
  }

  console.log(data)
  return (
    <div className={classes.chart}>
      <Chart
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        formatters={[
          {
            type: 'NumberFormat',
            column: 1,
            options: {
              prefix: '$'
            }
          }
        ]}
        options={{
          legend: 'none',
          title: props.product_name,
          vAxis: {title: 'Price', format: 'currency'},
          hAxis: {title: 'Time'},
          pointSize: 10,
        }}
        rootProps={{ 'data-testid': '4' }}
      />
    </div>
  );
}
