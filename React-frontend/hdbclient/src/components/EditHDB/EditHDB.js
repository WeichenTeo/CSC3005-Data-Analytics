import React, { Component } from 'react';
import axios from 'axios';
import Nav from '../nav.component';

export default class EditHDB extends Component {

    constructor(props) {
        super(props);

        this.onChangeToaddResalePrice = this.onChangeToaddResalePrice.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            block: '',
            Town: '',
            StreetName: '',
            PostalCode: '',
            StoreyRange: '',
            type: '',
            ResalePrice: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4500/getHDBById/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    block: response.data[0].block,
                    Town: response.data[0].Town,
                    StreetName: response.data[0].StreetName,
                    PostalCode: response.data[0].PostalCode,
                    StoreyRange: response.data[0].StoreyRange,
                    type: response.data[0].type,
                    ResalePrice: response.data[0].ResalePrice
                })
                console.log("in gethdbid", response);
            })

            .catch(function (error) {
                console.log(error)
            })
    }

    onChangeToaddResalePrice(e) {
        this.setState({
            ResalePrice: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            resalehdbid: this.props.match.params.id,
            ResalePrice: parseFloat(this.state.ResalePrice)
        };
        console.log("submitting id: " + obj.resalehdbid);
        console.log("submitting price: " + obj.ResalePrice);
        axios.put('http://localhost:4500/updateallresale/' + obj.resalehdbid, obj)
            .then(res => console.log(res.data));
        this.props.history.push('/Admin');
    }

    render() {
        return (
            <div>
                <Nav />
                <br />
                <br />
                <h3>Edit HDB Flat</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Block: <br />{this.state.block} </label>
                    </div>
                    <div className="form-group">
                        <label>Town: <br /> {this.state.Town}</label>
                    </div>
                    <div className="form-group">
                        <label>Street: <br /> {this.state.StreetName} </label>
                    </div>
                    <div className="form-group">
                        <label>Postal: <br /> {this.state.PostalCode}</label>
                    </div>
                    <div className="form-group">
                        <label>Storey Range: <br /> {this.state.StoreyRange}</label>
                    </div>
                    <div className="form-group">
                        <label>Flat Type: <br /> {this.state.type} </label>
                    </div>
                    <div className="form-group">
                        <label>Resale Price: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.ResalePrice}
                            onChange={this.onChangeToaddResalePrice}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input type="submit" value="Update HDB Flat" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}