import React, {Component} from 'react';
import axios from 'axios';
import {
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
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
import 'chartjs-adapter-luxon';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    Filler
);


var options = []
var dataPoints = []

// Set chart options after loading the data set
// This lets you use the date range of the data for setting the zoom limits and view area
function setOptions(data){
    const minutes =  15 * 60000;
    const xMin = Date.parse(data[0].x) - minutes;                               //First element of array minus offset
    const xMax = Date.parse(data[data.length - 1].x) + minutes;                 //Last element of array plus offset
    
    const viewRange = 86400000 * 30                                             // Number of days to show in default view
    const xViewMin = Math.max(xMin, xMax - viewRange)                           // Default to showing the last 30 days of data

    const options = {
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
                mode: 'x',
            },
            limits: {
                x: {min: xMin, max: xMax}
            }
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              // Luxon format string
              tooltipFormat: 'ff'
            },
            title: {
              display: true,
              text: 'Date'
            },
            min: xViewMin,
            max: xMax,
            ticks: {
                major: {
                    enabled: true
                }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: 10,
            max: 40
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            min: 0,
            max: 100
          },
        },
        elements:{
            line:{
                borderWidth: 2,
                tension: 0.2
            }
        },
      };
    
    return options;
}

// TODO: remove labels after refactor is complete
function formatChartData(dataset1, dataset2){
    const data = {
        datasets: [
          {
            label: 'Dataset 1',
            data: dataset1,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
            xAxisID: 'x',
            fill: false

          },
          {
            label: 'Dataset 2',
            data: dataset2,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y1',
            xAxisID: 'x',
            fill: false,
          },
        ],
      };
    return data;
}

class Chart extends Component{
    constructor(props){
        super(props);
        this.state = { isLoading: true, chartData: undefined, options: undefined};
    }

    componentDidMount() {
        // Add url to constants so that other computers can load data
        // This may be what's causing the CORS errors
        // axios.get('http://localhost:4000/measurements')
        // axios.get('http://192.168.0.53:4000/measurements')
        axios.get('http://10.1.10.95:4000/measurements')                // Broadview Taphouse ipaddr
        .then(res => {
            let tempData = res.data.map(obj => {
                let rObj = {}
                rObj['x'] = (new Date(obj.createdAt))
                rObj['y'] = obj.temperature
                return rObj
            })
            let humidityData = res.data.map(obj => {
                let rObj = {}
                rObj['x'] = (new Date(obj.createdAt))
                rObj['y'] = obj.humidity
                return rObj
            })
            dataPoints = formatChartData(tempData, humidityData);
            options = setOptions(tempData);
            this.setState({chartData: dataPoints})
            this.setState({chartOptions: options})
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
                    options={this.state.chartOptions}
                /> 
            </div>
        )
    }
}

export default Chart;