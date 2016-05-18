import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux'

export function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillMount() {
          this.checkAuth()
        }

        checkAuth() {
            if (!this.props.auth.isAuthenticated) {
                this.props.dispatch(push('/login'))
            }
        }

        render() {
            return (
                <div>
                    {this.props.auth.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    // We can add more authenticated user parameters as examples
    const mapStateToProps = (state) => ({
      auth: state.auth
    });

    return connect(mapStateToProps)(AuthenticatedComponent);

}
