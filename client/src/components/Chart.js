import React, {Component} from 'react';
import axios from 'axios';
import {
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

import {
    Bar,
    Line,
    Pie
} from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    Filler
);

// Sample data for bar graph
const data = {
    chartData:{
        labels: ['Seattle', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
        datasets:[
            {
                label:'Population',
                data:[
                    3251,
                    5135,
                    5351,
                    7885,
                    8745,
                    4952
                ]
            }
        ]
    }
}

// Sample data for multi-y-axis line graph
// export const data = {
//     labels,
//     datasets: [
//       {
//         label: 'Dataset 1',
//         data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         yAxisID: 'y',
//       },
//       {
//         label: 'Dataset 2',
//         data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//         borderColor: 'rgb(53, 162, 235)',
//         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         yAxisID: 'y1',
//       },
//     ],
//   };

var dataPoints = []

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const options = {
    maintainAspectRatio:true,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis',
      },
      zoom:{
        zoom: {
            wheel:{
                enabled: true,
            },
            pinch:{
                enabled: true,
            },
            drag: {
                enabled: true,
                modifierKey: 'shift',
            },
            mode: 'x',
        },
        pan: {
            enabled: true,
            drag: true,
            mode: 'x',
        },
      },

    },

    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 10,
        max: 15
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        min: 20,
        max: 50
      },
    },
    elements:{
        line:{
            borderWidth: 2,
            tension: 0.2
        }
    },
  };

function formatChartData(labels, dataset1, dataset2){
    const data = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: dataset1,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
            fill: false

          },
          {
            label: 'Dataset 2',
            data: dataset2,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y1',
            fill: false,
          },
        ],
      };
    return data;
}

class Chart extends Component{
    constructor(props){
        super(props);
        this.state = { isLoading: true, chartData: undefined};
        // this.state = data;
 

    }

    componentDidMount() {
        // Add url to constants so that other computers can load data
        // This may be what's causing the CORS errors
        // axios.get('http://localhost:4000/measurements')
        axios.get('http://192.168.0.53:4000/measurements')
        .then(res => {
            const stamps = res.data.map(s => s.createdAt)
            let tempData1 = res.data.map(t => t.temperature)
            let humidityData1 = res.data.map(h => h.humidity)
            let tempData = res.data.map(obj => {
                let rObj = {}
                rObj[obj.createdAt] = obj.temperature
                return rObj
            })
            let humidityData = res.data.map(obj => {
                let rObj = {}
                rObj[obj.createdAt] = obj.humidity
                return rObj
            })
            console.log(tempData)
            console.log(humidityData)
            console.log(stamps)
            // this.state.chartData = formatChartData(stamps, tempData, humidityData);
            dataPoints = formatChartData(stamps, tempData1, humidityData1);
            console.log(dataPoints)
            this.setState({chartData: dataPoints})
            this.setState({isLoading: false})
        })
    }

    render() {
        const {isLoading, chartData} = this.state;

        if (isLoading){
            return <div className='Chart'>Loading...</div>
        }
        return (
            <div className="Chart">
                <Line
                    data={this.state.chartData}
                    options={options}
                /> 
            </div>
        )
    }
}

export default Chart;