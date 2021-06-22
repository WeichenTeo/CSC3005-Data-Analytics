import React, { Component } from 'react';
import './TPTableRow.css';



export class TPTableRow extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.setState({});
    }


    render() {
        return (
            <tr>
                <td>{this.props.Name}</td>
                <td>{this.props.AveragePrice}</td>
            </tr>
        )
    }
}

export default TPTableRow;