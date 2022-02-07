import React, {Component} from 'react';
import axios from 'axios';
import Chart from './Chart';
import Table from './Table';

let data = {};

class DataPane extends Component{
    constructor(props){
        super(props);
        this.state = { isLoading: true}
    }

    componentDidMount() {
        axios.get('http://192.168.0.53:4000/measurements')
        .then(res => {
            data = res.data;
            console.log("data: ", data)
            this.setState({isLoading: false})
        })
    }
    
    render() {
        if (this.state.isLoading){
            return <div className='DataPane'>Loading...</div>
        }
        return (
            <div className='DataPane'>
                <Chart rawData={data}/>
                <Table rawData={data}/>
            </div>
        )
    }
}

export default DataPane;