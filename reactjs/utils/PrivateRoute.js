import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

import { login, logout, isLoggedIn } from './AuthService'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        ( isLoggedIn() )
        ? <Component {...props}/>
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }}/>

    )}/>
)

export default PrivateRoute
