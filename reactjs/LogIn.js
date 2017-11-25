import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'
import { login, isLoggedIn } from './utils/AuthService'

class BaseLogIn extends Component
{

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props)
    {
        super(props)
        this.state = { username: '', password: '' }

        this.handleSubmit   = this.handleSubmit.bind(this)
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
    }


    handleSubmit(event) {
        event.preventDefault()

        if (Boolean(this.state.username) === true &&
            Boolean(this.state.password) === true)
        {
            login(
                this.state.username,
                this.state.password,
                () => { this.props.history.push('/contacts') },
                () => { this.setState({
                    loginError: true,
                    errorMsg: 'Username or password incorrect.'
                }) }
            )
        } else {
            this.setState({loginError: true, errorMsg: 'Both fields are required'})
        }

    }

    updateUsername(event)
    {
        this.setState({ username: event.target.value });
    }

    updatePassword(event)
    {
        this.setState({ password: event.target.value });
    }

    render() {
        return (
            !isLoggedIn()
            ? (
                <div className="col-md-6 col-md-offset-3 text-center">
                    <form onSubmit={this.handleSubmit} className={this.state.loginError ? 'has-error' : ''}>
                        { this.state.loginError
                            ? <div className="alert alert-danger">{this.state.errorMsg}</div>
                            : '' }
                            <div className="form-group">
                                <input type="text"
                                    placeholder="username"
                                    className="form-control"
                                    value={this.state.username}
                                    onChange={this.updateUsername}/>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    placeholder="password"
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={this.updatePassword}/>
                            </div>
                            <input type="submit" className="btn btn-success"/>
                        </form>
                    </div>
            )
            : <Redirect to="/contacts"/>
        )
    }
}

const LogIn = withRouter(BaseLogIn)

export default LogIn
