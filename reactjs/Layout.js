import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import { login, logout, isLoggedIn } from './utils/AuthService';
import AuthButton from './AuthButton';

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
                        <Link to="/campaigns">Campañas</Link>
                    </li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <AuthButton/>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Layout
