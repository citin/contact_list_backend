import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import { login, logout, isLoggedIn } from './utils/AuthService';

class Layout extends Component
{

    render()
    {
        return (
            <nav className="navbar navbar-default">
                <div className="navbar-header">
                    <Link className="navbar-brand" to="/">APP</Link>
                </div>
                <ul className="nav navbar-nav">
                    <li>
                        <Link to="/contacts">Contactos</Link>
                    </li>
                    <li>
                        <Link to="/campaigns">Campanias</Link>
                    </li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        {
                            (isLoggedIn())
                                ? ( <button className="btn btn-danger log" onClick={() => logout()}>Log out </button> )
                                : ( <button className="btn btn-info log" onClick={() => login()}>Log In</button> )
                        }
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Layout
