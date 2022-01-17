import React, { Component } from 'react';
import axios from 'axios';

export default class DataTable extends Component {
    componentDidMount() {
        axios.get(`http://localhost:4000/measurements`)
          .then(res => {
            console.log(res.data)
            // const persons = res.data;
            // this.setState({ persons });
          })
      }

    render(){
      return (
          <div>
              Data table
          </div>
          
      )
    }
}