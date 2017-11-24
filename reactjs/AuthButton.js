import React from 'react'
import { withRouter } from 'react-router-dom'
import { login, logout, isLoggedIn } from './utils/AuthService'

const AuthButton = withRouter(({ history }) => (
    isLoggedIn()
    ? (
        <p>
            Welcome!
            <button className="btn btn-danger log" onClick={() => logout(() => history.push('/'))}>
                Log Out
            </button>
        </p>
    )
    : (
        <button className="btn btn-info log" onClick={() => login(() => history.push('/contacts'))}>
            Log In
        </button>
    )
)
)

export default AuthButton;
