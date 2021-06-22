import axios from "axios";
import { Component } from "react";
import Nav from '../nav.component';

export default class Login extends Component {

    handleSubmit = e => {
        e.preventDefault();

        const data = {
            Email: this.email,
            Password: this.password
        }

        console.log(data.Email);
        console.log(data.Password);

        axios.post('http://localhost:4500/login', data, { headers: { "Content-Type": "application/json" } })
            .then(res => {
                localStorage.setItem('token', res.data.Email)
                console.log(res);
                //var userId = res.data.UserID;
                if(res.data.status == "Success")
                {
                    var userId = res.data.UserId;
                    localStorage.setItem("UserId", userId);
                    this.props.history.push({
                        pathname: "/Admin"
                    })
                }
            })
            .catch(err => {
                console.log(err)
                console.log(data)
            })
    };

    render() {
        return (
            <div>
                <Nav />
                <form onSubmit={this.handleSubmit}>
                    <br />
                    <br />
                    <h3>Login</h3>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" placeholder="Email"
                            onChange={e => this.email = e.target.value} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password"
                            onChange={e => this.password = e.target.value} />
                    </div>

                    <button className="btn btn-primary btn-block"> login</button>
                </form>
            </div>
        )
    }
}