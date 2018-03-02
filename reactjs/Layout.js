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
                <div className="container-fluid">
                    <div className="collapse navbar-collapse">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">Campaigns App</Link>
                        </div>
                        <ul className="nav navbar-nav navbar-left">
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
                            {
                                isLoggedIn() ? '' : (
                                    <li>
                                        <Link to="/signin">Sign In</Link>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Layout
