import React, { Component } from 'react';
import Nav from '../nav.component';
import './HomeAdmin.css';
import SearchBar from '../SearchFilter/SearchBar';
import TableAdmin from '../Table/TableAdmin';
import TPTable from '../TownPriceTable/TPTable';




export default class Home extends Component {
  constructor(props) {
    super(props);

    this.data = []; // this data should not live in state
    this.tpdata = [];
    this.state = {
      resalehdbid: '',
      block: '',
      Town: '',
      StreetName: '',
      PostalCode: '',
      StoreyRange: '',
      type: '',
      ResalePrice: '',
      Name: '',
      AveragePrice: '',
      isLoading: true,
    };
  }

  // fetch src data from JSON url (on Github)
  //UNSAFE_componentWillMount()
  componentDidMount() {
    console.log("Hello");
    // Where we're fetching data from
    fetch(`http://localhost:4500/all`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      .then(data => {
        let array = [];
        console.log(data);
        //for (let i = 0; i < data[0].length; i++) {
        for (let i = 0; i < 10; i++) {
          let entry = {};
          //key value pairs
          entry.resalehdbid = data[i].resalehdbid.toString();
          entry.block = data[i].block;
          entry.Town = data[i].Town;
          entry.StreetName = data[i].StreetName;
          entry.PostalCode = data[i].PostalCode.toString();
          entry.StoreyRange = data[i].StoreyRange;
          entry.type = data[i].type;
          entry.ResalePrice = data[i].ResalePrice.toString();

          array[i] = entry;
        }
        this.data = array;
        this.setState({
          isLoading: false,
        });
      })

      // Catch any errors we hit and update the app
      .catch(error => this.setState({ error, isLoading: false }));

    fetch(`http://localhost:4500/getAverageResalePrice`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      .then(data => {
        let array = [];

        for (let i = 0; i < data.data.length; i++) {
          let entry = {};
          //key value pairs
          entry.Name = data.data[i].Name;
          entry.AveragePrice = "$" + data.data[i].AveragePrice.toFixed(2);

          array[i] = entry;
        }
        this.tpdata = array;
        this.setState({
          isLoading: false,
        });
      })

      // Catch any errors we hit and update the app
      .catch(error => this.setState({ error, isLoading: false }));

  }

  componentDidUpdate() {
    // Where we're fetching data from
    fetch(`http://localhost:4500/all`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      .then(data => {
        let array = [];

        //for (let i = 0; i < data[0].length; i++) {
        for (let i = 0; i < 5; i++) {
          let entry = {};
          //key value pairs
          entry.resalehdbid = data[i].resalehdbid.toString();
          entry.block = data[i].block;
          entry.Town = data[i].Town;
          entry.StreetName = data[i].StreetName;
          entry.PostalCode = data[i].PostalCode.toString();
          entry.StoreyRange = data[i].StoreyRange;
          entry.type = data[i].type;
          entry.ResalePrice = data[i].ResalePrice.toString();

          array[i] = entry;
        }
        this.data = array;
        this.setState({
          isLoading: false,
        });
      })

      // Catch any errors we hit and update the app
      .catch(error => this.setState({ error, isLoading: false }));


  }

  handleSearchEvents = (title, name) => {
    this.setState({ [name]: title });
  }

  render() {
    // console.log(this.data); // data is array of objects
    const filteredData = this.data.filter((dataObj) => (dataObj.block.indexOf(this.state.block) !== -1) &&
      (dataObj.Town.indexOf(this.state.Town) !== -1) &&
      (dataObj.StreetName.indexOf(this.state.StreetName) !== -1) &&
      (dataObj.PostalCode.indexOf(this.state.PostalCode) !== -1) &&
      (dataObj.StoreyRange.indexOf(this.state.StoreyRange) !== -1) &&
      (dataObj.type.indexOf(this.state.type) !== -1) &&
      (dataObj.ResalePrice.indexOf(this.state.ResalePrice) !== -1));

    // console.log(this.tpdata);
    const filteredData1 = this.tpdata.filter((dataObj) => (dataObj.Name.indexOf(this.state.Name) !== -1) &&
      (dataObj.AveragePrice.indexOf(this.state.AveragePrice) !== -1));


    return (
      <div className="App">
        <Nav />
        <br />
        <br />
        <h1>HDB Resale Flats</h1>
        <SearchBar
          block={this.state.block}
          Town={this.state.Town}
          StreetName={this.state.StreetName}
          PostalCode={this.state.PostalCode}
          StoreyRange={this.state.StoreyRange}
          type={this.state.type}
          ResalePrice={this.state.ResalePrice}
          handleSearchEvents={this.handleSearchEvents} />
        <TableAdmin
          block={this.state.block}
          Town={this.state.Town}
          StreetName={this.state.StreetName}
          PostalCode={this.state.PostalCode}
          StoreyRange={this.state.StoreyRange}
          type={this.state.type}
          ResalePrice={this.state.ResalePrice}
          resalehdbid={this.state.resalehdbid}
          data={filteredData}
        />
        <br />
        <TPTable
          Name={this.state.Name}
          AveragePrice={this.state.AveragePrice}
          data={filteredData1} />
      </div>
    )
  }
}