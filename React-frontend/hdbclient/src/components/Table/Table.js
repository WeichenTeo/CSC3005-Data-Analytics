import React, { Component } from 'react';
import TableRow from './TableRow';
import './Table.css';


export class Table extends Component {
    render() {
        let rows = [];

        //generate the table rows
        //based on container representational pattern and Hook, CountryTable should not have business logic
        this.props.data.forEach((dataObj) => {
            rows.push(
                <TableRow
                    key={dataObj.block}
                    block={dataObj.block}
                    Town={dataObj.Town}
                    StreetName={dataObj.StreetName}
                    PostalCode={dataObj.PostalCode}
                    StoreyRange={dataObj.StoreyRange}
                    type={dataObj.type}
                    ResalePrice={dataObj.ResalePrice}
                    resalehdbid={dataObj.resalehdbid}
                />);
        });



        return (
            <table id='tableStyle'>
                <thead>
                    <tr>
                        <th>Block</th>
                        <th>Town</th>
                        <th>Street</th>
                        <th>Postal</th>
                        <th>Storey Range</th>
                        <th>Flat Type</th>
                        <th>Resale Price($)</th>
                    </tr>
                </thead>
                <tbody id='tableBodyStyle'>
                    {rows}
                </tbody>
            </table>
        )
    }
}
export default Table