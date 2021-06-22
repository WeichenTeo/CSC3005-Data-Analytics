import React, { Component } from 'react';
import TableRowAdmin from './TableRowAdmin';
import './TableAdmin.css';
//import { MDBDataTableV5 } from 'mdbreact';

export class TableAdmin extends Component {
    render() {
        let rows = [];

        //generate the table rows
        //based on container representational pattern and Hook, CountryTable should not have business logic
        this.props.data.forEach((dataObj) => {
            rows.push(
                <TableRowAdmin
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
            <table className='tableStyle'>
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
                <tbody className='tableBodyStyle'>
                    {rows}
                </tbody>
            </table>
        )
    }
}

export default TableAdmin