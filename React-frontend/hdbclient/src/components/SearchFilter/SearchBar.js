import React, { Component } from 'react';
import './SearchBar.css'

export class SearchBar extends Component {

    handleOnChange = (e) => {
        //console.log('value: '+e.target.value+ ' name: '+ e.target.name);
        this.props.handleSearchEvents(e.target.value, e.target.name);
    };

    render() {
        return (
            <form className='SearchBarStyle'>
                <input
                    type="text"
                    name='block'
                    value={this.props.block}
                    onChange={this.handleOnChange}
                    placeholder='Block' />
                {/* </label> */}
                <input
                    type="text"
                    name='Town'
                    value={this.props.Town}
                    onChange={this.handleOnChange}
                    placeholder='Town' />
                <input
                    type="text"
                    name='StreetName'
                    value={this.props.StreetName}
                    onChange={this.handleOnChange}
                    placeholder='Street' />
                <input
                    type="text"
                    name='PostalCode'
                    value={this.props.PostalCode}
                    onChange={this.handleOnChange}
                    placeholder='Postal' />
                <input
                    type="text"
                    name='StoreyRange'
                    value={this.props.StoreyRange}
                    onChange={this.handleOnChange}
                    placeholder='Storey Range' />
                <input
                    type="text"
                    name='type'
                    value={this.props.type}
                    onChange={this.handleOnChange}
                    placeholder='Flat Type' />
                <input
                    type="text"
                    name='ResalePrice'
                    value={this.props.ResalePrice}
                    onChange={this.handleOnChange}
                    placeholder='Resale Price' />
            </form >
        )
    }
}

export default SearchBar