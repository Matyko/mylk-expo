import React, {Component} from "react";
import {AsyncStorage, StyleSheet, View} from "react-native";
import {Input} from "react-native-elements";
import FancyButton from "../components/FancyButton";
import mLogger from "../util/mLogger";
import * as firebase from "firebase";
import {LinearGradient} from "expo-linear-gradient";
import Colors from '../constants/Colors'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {
                desc: ''
            }
        }
    }

    componentDidMount() {
        try {
            AsyncStorage.getItem('email').then(email => {
                if (email) {
                    this.setState({...this.state, ...{email}})
                }
            })
        } catch {
            mLogger('did not find saved email')
        }
    }

    login() {
        this.setState({...this.state, ...{loading: true}});
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            AsyncStorage.setItem('email', this.state.email);
            this.props.navigation.navigate('Main')
        })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                this.setState({...this.state, ...{loading: false}});
            })
    }

    register() {
        this.setState({...this.state, ...{loading: true}});
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(r => {
            this.login();
        })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                this.setState({...this.state, ...{loading: true}});
            })
    }

    render() {
        return (
            <LinearGradient
                start={[0, 1]}
                end={[1, 0]}
                colors={[Colors.primaryBackground, Colors.transparent]}
                style={styles.container}
            >
                <View style={styles.form}>
                    <View style={styles.formElement}>
                        <Input
                            style={styles.input}
                            placeholder='Enter email'
                            errorMessage={this.state.errors.desc}
                            placeholderTextColor={Colors.white}
                            inputStyle={{borderColor: Colors.white}}
                            value={this.state.email}
                            onChangeText={email => this.setState({...this.state, ...{email}})}
                        />
                    </View>
                    <View style={styles.formElement}>
                        <Input
                            style={styles.input}
                            placeholder='Enter password'
                            errorMessage={this.state.errors.desc}
                            placeholderTextColor={Colors.white}
                            inputStyle={{borderColor: Colors.white}}
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={password => this.setState({...this.state, ...{password}})}
                        />
                    </View>
                </View>
                <View style={styles.lastElement}>
                    <FancyButton
                        title="Login"
                        textColor={Colors.white}
                        borderColor={Colors.white}
                        loaderColor={Colors.white}
                        loading={this.state.loading}
                        pressFn={() => this.login()}
                    />
                    <FancyButton
                        title="Register"
                        textColor={Colors.white}
                        borderColor={Colors.white}
                        loaderColor={Colors.white}
                        loading={this.state.loading}
                        pressFn={() => this.register()}
                    />
                </View>
            </LinearGradient>
        )
    }
}

LoginScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
   container: {
        flex: 1,
        padding: 22,
   },
    form: {
        flexDirection: 'column',
        flexGrow: 2,
        justifyContent: 'flex-end'
    },
    formElement: {
        margin: 20
    },
    input: {
      color: Colors.white,
      borderColor: Colors.white
    },
    lastElement: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        margin: 20
    }
});
