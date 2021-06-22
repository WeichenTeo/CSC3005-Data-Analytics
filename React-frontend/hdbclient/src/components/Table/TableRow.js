import React, { Component } from 'react';
import axios from 'axios';
import './TableRow.css';



export class TableRow extends Component {
    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete(e) {
        e.preventDefault();
        var deleteID = this.props.resalehdbid

        axios.delete('http://localhost:4500/deletefromresale/' + deleteID)
            .then(res => console.log(res.data));
    }

    componentDidMount() {
        this.setState({});
    }


    render() {
        return (
            <tr>
                <td>{this.props.block}</td>
                <td>{this.props.Town}</td>
                <td>{this.props.StreetName}</td>
                <td>{this.props.PostalCode}</td>
                <td>{this.props.StoreyRange}</td>
                <td>{this.props.type}</td>
                <td>{this.props.ResalePrice}</td>
                <td><button className="btn btn-outline-primary ml-2 my-2 my-sm-0" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/View/" + this.props.resalehdbid;
                }}>View More</button></td>
            </tr>
        )
    }
}

export default TableRow;