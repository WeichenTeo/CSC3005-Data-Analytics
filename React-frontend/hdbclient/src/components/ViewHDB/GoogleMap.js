import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
//
//This is the example of calling the  component: <GoogleMap lat={1.398520085227367} lng={103.89675199626468} zoom={15}/>
const AnyReactComponent = ({ text }) => <div style={{
    color: 'white', 
    background: 'grey',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    fontSize: '10px'
  }}>{text}</div>;

export class GoogleMap extends React.Component {
  render() {
   
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAsgJVEWKhCsX2Ao4jzXZ6TY3IHKcmdtI0" }}
          defaultCenter={{lat:this.props.lat,lng:this.props.lng}}
          defaultZoom={this.props.zoom}
        >
       <AnyReactComponent
            lat={this.props.lat}
            lng={this.props.lng}
            text={this.props.marker}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
export default GoogleMap;