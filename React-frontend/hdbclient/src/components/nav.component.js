import { Component } from "react"
import { Link } from "react-router-dom"

export default class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: localStorage.getItem('isLoggedIn') || 0
        }

        window.addEventListener('storage', (e) => this.storageChanged(e))
        this.storageChanged = this.storageChanged.bind(this)
    }

    storageChanged(e) {
        if (e.key === 'isLoggedIn') {
            this.setState({ isLoggedIn: e.newValue })
        }
    }

    render() {
        let buttons;
        var userId = localStorage.getItem("UserId");
        //console.log(userId);
        if (userId != null) {
            buttons = (<ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={'/login'} onClick={() => localStorage.clear()}>Logout</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to={'/UploadFiles'} >Add</Link>
                </li>
            </ul>
            )
        }


        else {
            buttons = (<ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={'/login'}>Login</Link>
                </li>
            </ul>
            )
        }


        return (
            <nav className="navbar navbar-expand navbar-light fixed-top">
                <div className="container">
                    {!(userId == 1) && <div><Link className="navbar-brand" to={'/'}>Home</Link></div>}
                    {(userId == 1) && <div><Link className="navbar-brand" to={'/Admin'}>Home</Link></div>}
                    <div className="collapse navbar-collapse">
                        {buttons}
                    </div>
                </div>
            </nav>
        )
    }
}