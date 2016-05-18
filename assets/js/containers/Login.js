require('script!../dependencies/sails.io.js');

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

class Login extends Component {

  constructor(props) {
    super(props)

    this.authenticate = this.authenticate.bind(this)
    this.submitLogin = this.submitLogin.bind(this)
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }

  componentWillMount() {
    var email = this.getCookie("email")
    var password = this.getCookie("password")
    if (email != "" && password != "") {
      this.authenticate({email: email, password: password})
    }
  }

  submitLogin(e) {
    e.preventDefault()
    console.log("checking user")
    const postable = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.setCookie("email", postable.email, 1)
    this.setCookie("password", postable.password, 1)
    this.authenticate(postable)
  }

  authenticate(postable) {
    io.socket.post('/auth/signin', postable, function (data) {
      this.props.dispatch({type: 'LOGIN', token: data.token})
      this.props.dispatch(push('/'))
    }.bind(this))
  }

  render() {
    var errors = (
      <div className="ui message error">Your username and password did not match. Please try again.</div>
    )
    return (
      <div className="ui middle aligned center grid">
        <div className="column">
          <div className="logo"><strong><i className="icon cubes"></i> NodeBIT</strong></div>
          <form className="ui form" onSubmit={this.submitLogin}>
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input type="text" ref="email"/>
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" ref="password"/>
              </div>
            </div>
            <div className="field">
              <input className="ui primary button full width" type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    )
  }

}

// so this is bad because now we have a render every time anything in the state changes
export default connect(state => state)(Login)
