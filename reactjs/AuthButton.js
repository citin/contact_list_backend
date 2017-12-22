import React from 'react'
import { withRouter } from 'react-router-dom'
import { login, logout, isLoggedIn } from './utils/AuthService'

const AuthButton = withRouter(({ history }) => (
    isLoggedIn()
    ? (
        <a href="#" onClick={() => logout(() => history.push('/'))}>
            Log Out
        </a>
    )
    : (
        <a href="#" onClick={() => login(() => history.push('/contacts'))}>
            Log In
        </a>
    )
)
)

export default AuthButton;
