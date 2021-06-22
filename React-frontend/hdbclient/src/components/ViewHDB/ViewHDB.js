import React, { Component } from 'react';
import axios from 'axios';
import Nav from '../nav.component';
import GoogleMap from './GoogleMap';
export default class ViewHDB extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onCompare = this.onCompare.bind(this);
        this.onChangeDestinationPostalCode = this.onChangeDestinationPostalCode.bind(this);
        this.onChangeDistance = this.onChangeDistance.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);

        this.state = {
            block: null,
            Town: null,
            StreetName: null,
            PostalCode: null,
            Latitude: null,
            Longitude: null,
            StoreyRange: null,
            FloorArea: null,
            type: null,
            model: null,
            LeaseCommenceDate: null,
            LeaseEndDate: null,
            ResalePrice: null,
            destinationPostalCode: null,
            distance: null,
            duration: null
        }
    }


    componentDidMount() {
        axios.get('http://localhost:4500/getHDBById/' + this.props.match.params.id)
            .then(response => {
                console.log(response);
                this.setState({
                    block: response.data[0].block,
                    Town: response.data[0].Town,
                    StreetName: response.data[0].StreetName,
                    PostalCode: response.data[0].PostalCode,
                    StoreyRange: response.data[0].StoreyRange,
                    FloorArea: response.data[0].FloorArea,
                    Latitude: response.data[0].Latitude,
                    Longitude: response.data[0].Longitude,
                    type: response.data[0].type,
                    model: response.data[0].model,
                    LeaseCommenceDate: response.data[0].LeaseCommenceDate,
                    LeaseEndDate: response.data[0].LeaseEndDate,
                    ResalePrice: response.data[0].ResalePrice
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    onChangeDestinationPostalCode(e) {
        this.setState({
            destinationPostalCode: e.target.value
        });
    }

    onChangeDistance(e) {
        this.setState({
            distance: e.target.value
        });
    }

    onChangeDuration(e) {
        this.setState({
            duration: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.history.push('/');
    }

    onCompare(e) {
        console.log("buttonClick")
        e.preventDefault();
        const obj = {
            orginPostalCode: this.state.PostalCode,
            destinationPostalCode: this.state.destinationPostalCode
        };

        axios.post('http://localhost:4500/googleAPI', obj)
            .then(res => {
                console.log(res);
                this.setState({
                    distance: res.data.distance,
                    duration: res.data.duration
                })
            })
            .catch(function (error) {
                console.log(error)
            })

    }

    render() {
        let lat = this.state.Latitude;
        let lng = this.state.Longitude;
        let PostalCode = this.state.PostalCode;
        return (
            <div class="container">
                <Nav />
                <br />
                <br />
                <div>
                    <h3>View HDB Flat</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input type="submit" value="Back" className="btn btn-primary" />
                        </div>
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
                            <label>Floor Area: <br /> {this.state.FloorArea} </label>
                        </div>
                        <div className="form-group">
                            <label>Flat Type: <br /> {this.state.type} </label>
                        </div>
                        <div className="form-group">
                            <label>Flat Model: <br /> {this.state.model} </label>
                        </div>
                        <div className="form-group">
                            <label>Lease Commence Date: <br /> {this.state.LeaseCommenceDate} </label>
                        </div>
                        <div className="form-group">
                            <label>Lease End Date: <br /> {this.state.LeaseEndDate} </label>
                        </div>
                        <div className="form-group">
                            <label>Resale Price: <br /> {this.state.ResalePrice}</label>
                        </div>
                        <br />

                    </form>
                </div>
                <div>
                    <form onSubmit={this.onCompare}>
                        <h4>Enter Postal code of another location to calculate the distance from this HDB Flat.</h4>
                        <div className="form-group">
                            <label>Destination Postal Code: </label>
                            <input type="text"
                                className="form-control"
                                value={this.state.destinationPostalCode}
                                onChange={this.onChangeDestinationPostalCode}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Compare" className="btn btn-primary" />
                        </div>
                        <div className="form-group">
                            <label>Distance to destination postal code:<br /> {this.state.distance}</label>
                        </div>
                        <div className="form-group">
                            <label>Duration to destination postal code: <br /> {this.state.duration} </label>
                        </div>
                        {lat?(<GoogleMap lat={lat} lng={lng} zoom={15} marker={PostalCode}/>): null}
                        
                    </form>
                </div>
            </div>
        )
    }
}