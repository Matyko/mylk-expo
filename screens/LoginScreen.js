import React, {Component} from "react";
import {AsyncStorage, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {Input} from "react-native-elements";
import FancyButton from "../components/FancyButton";
import mLogger from "../util/mLogger";
import * as firebase from "firebase";
import {LinearGradient} from "expo-linear-gradient";
import Colors from '../constants/Colors'
import {Video} from "expo-av";

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
            <View style={styles.container}>
                <Video
                    source={{ uri: "https://s3-eu-west-1.amazonaws.com/video.gallereplay.com/artistarea/Lighthouse%20stands%20in%20Istanbul%E2%80%99s%20harbour_0554659b-5dc1-43d6-8a93-b31ec6b67f63/Cinemagraph_plain/1920x1080/cinemagraph.mp4"}}
                    style={styles.backgroundVideo}
                    rate={1}
                    shouldPlay={true}
                    isLooping={true}
                    volume={1}
                    muted={true}
                    resizeMode="cover"
                />
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <View style={styles.loginContainer}>
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
                                loading={this.state.loading}
                                pressFn={() => this.login()}
                            />
                            <FancyButton
                                title="Register"
                                loading={this.state.loading}
                                pressFn={() => this.register()}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

LoginScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.transparent,
    },
    loginContainer: {
        flexGrow: 1
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    form: {
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center'
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
    },
    logo: {
      flexGrow: 1,
        justifyContent: 'center'
    },
    logoText: {
       color: Colors.white,
        fontSize: 70,
        textAlign: 'center'
    },

});
