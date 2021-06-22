import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Upload from './components/AddHDB/Upload.js';
import EditHDB from './components/EditHDB/EditHDB.js';
import ViewHDB from './components/ViewHDB/ViewHDB.js';
import Login from './components/Login/Login.js'
import Home from './components/Home/Home.js';
import HomeAdmin from './components/Home/HomeAdmin.js';






class App extends Component {

  render() {
    return (
      <div>
        <Router>
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            </nav>

            <Route path="/" exact component={Home} />
            <Route path="/Admin" exact component={HomeAdmin} />
            <Route path="/Edit/:id" component={EditHDB} />
            <Route path="/View/:id" component={ViewHDB} />
            <Route path="/UploadFiles" component={Upload} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
