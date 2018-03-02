import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'
import { signin, isLoggedIn } from './utils/AuthService'

class BaseSignIn extends Component
{

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props)
    {
        super(props)
        this.state = { username: '', password: '', passConfirm: '' }

        this.handleSubmit   = this.handleSubmit.bind(this)
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.updatePassConfirm = this.updatePassConfirm.bind(this)
    }


    handleSubmit(event) {
        event.preventDefault()

        if (Boolean(this.state.username) === true &&
            Boolean(this.state.password) === true &&
            this.state.password === this.state.passConfirm)
        {
            signin(
                this.state.username,
                this.state.password,
                this.state.passConfirm,
                () => { this.props.history.push('/login') },
                () => { this.setState({
                    loginError: true,
                    errorMsg: 'Username or password incorrect.'
                }) }
            )
        } else {
            this.setState({loginError: true, errorMsg: 'Something is wrong, please check all fields and type same password twice.'})
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

    updatePassConfirm(event)
    {
        this.setState({ passConfirm: event.target.value });
    }

    componentDidMount()
    {
        this.userNameInput.focus();
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
                                    ref={(input) => { this.userNameInput = input; }}
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
                            <div className="form-group">
                                <input type="password"
                                    placeholder="password confirmation"
                                    className="form-control"
                                    value={this.state.passConfirm}
                                    onChange={this.updatePassConfirm}/>
                            </div>
                            <input type="submit" className="btn btn-success"/>
                        </form>
                    </div>
            )
            : <Redirect to="/contacts"/>
        )
    }
}

const SignIn = withRouter(BaseSignIn)

export default SignIn
