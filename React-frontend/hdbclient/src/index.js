import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

ReactDOM.render(<React.StrictMode>
    <App />
</React.StrictMode>, document.getElementById('root'));

axios.defaults.baseURL = 'http://localhost:8080/api/';

axios.defaults.headers.common['Authorization'] = 'Bearer' + localStorage.getItem('token');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
