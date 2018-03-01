import React from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { login, logout, isLoggedIn } from './utils/AuthService'

const AuthButton = withRouter(({ history }) => (
    isLoggedIn()
    ? (
        <a href="#" onClick={() => logout(() => history.push('/'))}>
            Log Out
        </a>
    )
    :  <Link to="/login">Log in</Link>
)
)

export default AuthButton;
