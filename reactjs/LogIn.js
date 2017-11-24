import React, {Component} from 'react'

// TODO: login with this component
class LogIn extends Component
{

    construct()
    {
        this.setState({ login_error: false })
    }


    handleSubmit(e) {
        e.preventDefault()

        var username = this.refs.username.value
        var pass = this.refs.pass.value

        auth.login(username, pass, (loggedIn) => {
            if (loggedIn) {
                this.context.router.replace('/app/')
            } else {
                this.setState({login_error:true})
            }
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="username" ref="username"/>
                <input type="password" placeholder="password" ref="pass"/>
                <input type="submit"/>
            </form>
        )
    }
}

export default LogIn
