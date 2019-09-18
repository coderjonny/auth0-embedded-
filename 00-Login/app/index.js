/**
 * Auth0Sample 00-Login
 * https://github.com/auth0/react-native-auth0
 * @flow
 */

import React, { Component } from 'react';
import {
    Alert,
    AppRegistry,
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
// import LoginModal from '../modals/LoginModal'
import LoginModal from './modals/LoginModal'

var credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);

export default class Auth0Sample extends Component {
    constructor(props) {
        super(props);
        this.state = { accessToken: null, modalVisible: false };
        this.onAuth = this.onAuth.bind(this)
    }

    _onLogin = () => {
        auth0.webAuth
            .authorize({
                scope: 'openid profile',
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                Alert.alert(
                    'Success',
                    'AccessToken: ' + credentials.accessToken, [{
                        text: 'OK',
                        onPress: () => console.log('OK Pressed')
                    }], { cancelable: false }
                );
                this.setState({ accessToken: credentials.accessToken });
            })
            .catch(error => console.log(error));
    };

    _onLogout = () => {
        auth0.webAuth
            .clearSession({})
            .then(success => {
                Alert.alert(
                    'Logged out!'
                );
                this.setState({ accessToken: null });
            })
            .catch(error => {
                console.log("Log out cancelled");
            });
    };

    onPressHandle = () => {
        this.setState({ modalVisible: true })
        console.log('login pressed')
    };

    onAuth = (credentials, profile) => {
      this.setState({modalVisible: false}, () => 
      this.props.navigation.navigate('Profile', {credentials: credentials, profile: profile}) )
    };

    render() {
        let loggedIn = this.state.accessToken === null ? false : true;
        return (
            <View style={styles.container}>
                <Text style={styles.header}> Auth0Sample - Login </Text>
                <Text>
                    You are {loggedIn ? '' : 'not '} logged in . </Text>
                <Button onPress={loggedIn ? this._onLogout : this._onLogin}
                    title={loggedIn ? 'Log Out' : 'Log In'} />
                <Button
                    onPress={ this.onPressHandle}
                    title="Log In test embed"
                />
                <LoginModal modalVisible={this.state.modalVisible} onAuth={this.onAuth}/>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});

AppRegistry.registerComponent('Auth0Samples', () => Auth0Sample);  