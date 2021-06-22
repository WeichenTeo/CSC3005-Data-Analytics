import React, { Component } from 'react';
import TPTableRow from './TPTableRow';
import './TPTable.css';
//import { MDBDataTableV5 } from 'mdbreact';

export class TPTable extends Component {
    render() {
        let rows = [];

        //generate the table rows
        this.props.data.forEach((dataObj) => {
            rows.push(
                <TPTableRow
                    key={dataObj.Name}
                    Name={dataObj.Name}
                    AveragePrice={dataObj.AveragePrice}
                />);
        });



        return (
            <table className='tableStyle'>
                <thead>
                    <tr>
                        <th>Town</th>
                        <th>Average Resale Price</th>
                    </tr>
                </thead>
                <tbody className='tableBodyStyle'>
                    {rows}
                </tbody>
            </table>
        )
    }
}

export default TPTable