import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

export default class Login extends Component {
  state = {username: '', password: '', isErrorLogin: false, errorMsg: ''}

  submitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({username: '', password: '', isErrorLogin: false})
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({isErrorLogin: true, errorMsg: data.error_msg})
    }
  }

  usernameInput = event => {
    this.setState({username: event.target.value})
  }

  passwordInput = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameInput = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          value={username}
          placeholder="Username"
          className="input"
          onChange={this.usernameInput}
        />
      </>
    )
  }

  renderPasswordInput = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Password"
          className="input"
          onChange={this.passwordInput}
        />
      </>
    )
  }

  render() {
    const {isErrorLogin, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="jobby-login-bg-container">
        <form className="jobby-form-container" onSubmit={this.submitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="jobby-website-logo"
          />
          <div className="jobby-input-container">
            {this.renderUsernameInput()}
          </div>
          <div className="jobby-input-container">
            {this.renderPasswordInput()}
          </div>
          <button type="submit" className="jobby-submit">
            Login
          </button>
          {isErrorLogin && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
