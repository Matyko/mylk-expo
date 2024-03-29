import React, { Component } from 'react';
import { Animated, AsyncStorage, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import * as firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Video } from 'expo-av';
import FancyButton from '../components/FancyButton';
import mLogger from '../util/mLogger';
import { StyledText } from '../components/StyledText';
import Colors from '../constants/Colors';
import PassCode from '../components/PassCode';
import STORAGE_CONSTS from '../util/storageConsts';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      rememberMe: false,
      passCode: '',
      errors: {
        desc: '',
      },
      passCodeCheck: false,
      loaded: false,
    };
    this.animVal = new Animated.Value(1);
  }

  animate() {
    Animated.spring(this.animVal, {
      toValue: 0,
    }).start(() => this.setState({ ...this.state, ...{ loaded: true } }));
  }

  async componentDidMount() {
    try {
      const passCode = await SecureStore.getItemAsync(STORAGE_CONSTS.PASSCODE);
      const password = await SecureStore.getItemAsync(STORAGE_CONSTS.PASSWORD);

      const email = await AsyncStorage.getItem(STORAGE_CONSTS.EMAIL);
      const rememberMe = JSON.parse(await AsyncStorage.getItem(STORAGE_CONSTS.REMEMBER_ME));

      if (email) this.setState({ ...this.state, ...{ email } });
      if (rememberMe) this.setState({ ...this.state, ...{ rememberMe } });
      if (passCode) this.setState({ ...this.state, ...{ passCode } });

      if (rememberMe && password && email) {
        if (password) this.setState({ ...this.state, ...{ password } });

        if (passCode) {
          this.animate();
          this.setState({ ...this.state, ...{ passCodeCheck: true } });
        } else {
          this.login();
        }
      } else {
        this.animate();
      }
    } catch (e) {
      this.animate();
      mLogger('did not find saved data');
    }
  }

  checkPassCode(code) {
    if (this.state.passCode === code) {
      this.login();
    }
  }

  async rememberMe() {
    await this.setState({ ...this.state, ...{ rememberMe: !this.state.rememberMe } });
    await AsyncStorage.setItem(STORAGE_CONSTS.REMEMBER_ME, JSON.stringify(this.state.rememberMe));
  }

  login() {
    this.setState({ ...this.state, ...{ loading: true } });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async ({ user }) => {
        this.animate();
        if (this.state.rememberMe) {
          await SecureStore.setItemAsync(STORAGE_CONSTS.USER_ID, user.uid);
          await AsyncStorage.setItem(STORAGE_CONSTS.EMAIL, this.state.email);
          await SecureStore.setItemAsync(STORAGE_CONSTS.PASSWORD, this.state.password);
        }
        this.props.navigation.navigate('Main');
      })
      .catch(e => {
        console.log(e);
        this.setState({ ...this.state, ...{ loading: false } });
      });
  }

  register() {
    this.setState({ ...this.state, ...{ loading: true } });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(r => {
        this.login();
      })
      .catch(e => {
        console.log(e);
        this.setState({ ...this.state, ...{ loading: false } });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<Video*/}
        {/*  source={require('../assets/video/11.mp4')}*/}
        {/*  style={styles.backgroundVideo}*/}
        {/*  rate={1}*/}
        {/*  shouldPlay={true}*/}
        {/*  isLooping={true}*/}
        {/*  volume={1}*/}
        {/*  muted={true}*/}
        {/*  resizeMode="cover"*/}
        {/*/>*/}
        {!this.state.loaded && (
          <Animated.Image
            source={require('../assets/images/splash.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: this.animVal.interpolate({ inputRange: [0, 1], outputRange: [0.01, 1] }),
            }}
          />
        )}
        <LinearGradient
          start={[0, 1]}
          end={[1, 0]}
          colors={[Colors.primaryText, Colors.primaryBackground]}
          style={[styles.backgroundVideo, { opacity: 0.6 }]}
        />
        {this.state.loaded && (
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.loginContainer}>
              <View style={styles.logo}>
                <StyledText style={styles.logoText}>mylk</StyledText>
              </View>
              {!this.state.passCodeCheck && (
                <View style={styles.form}>
                  <View style={styles.formElement}>
                    <Input
                      placeholder="Enter email"
                      errorMessage={this.state.errors.desc}
                      placeholderTextColor={Colors.white}
                      inputStyle={styles.input}
                      inputContainerStyle={{ borderColor: Colors.white }}
                      value={this.state.email}
                      onChangeText={email => this.setState({ ...this.state, ...{ email } })}
                    />
                  </View>
                  <View style={styles.formElement}>
                    <Input
                      placeholder="Enter password"
                      errorMessage={this.state.errors.desc}
                      placeholderTextColor={Colors.white}
                      inputStyle={styles.input}
                      inputContainerStyle={{ borderColor: Colors.white }}
                      secureTextEntry={true}
                      value={this.state.password}
                      onChangeText={password => this.setState({ ...this.state, ...{ password } })}
                    />
                  </View>
                  <View style={styles.formElement}>
                    <CheckBox
                      checked={this.state.rememberMe}
                      containerStyle={{
                        backgroundColor: Colors.transparent,
                        borderColor: Colors.transparent,
                      }}
                      textStyle={{ color: Colors.white }}
                      checkedColor={Colors.white}
                      uncheckedColor={Colors.white}
                      onPress={() => this.rememberMe()}
                      title="Remember me"
                    />
                  </View>
                </View>
              )}
              {!this.state.passCodeCheck && (
                <View style={styles.lastElement}>
                  <FancyButton
                    title="Login"
                    borderColor={Colors.white}
                    textColor={Colors.white}
                    loading={this.state.loading}
                    pressFn={() => this.login()}
                  />
                  <FancyButton
                    title="Register"
                    borderColor={Colors.white}
                    textColor={Colors.white}
                    loading={this.state.loading}
                    pressFn={() => this.register()}
                  />
                </View>
              )}
              {this.state.passCodeCheck && (
                <PassCode
                  backgroundColor={Colors.transparent}
                  passCode={this.state.passCode}
                  codeEntered={code => this.checkPassCode(code)}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  }
}

LoginScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  loginContainer: {
    flexGrow: 1,
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
    justifyContent: 'center',
  },
  formElement: {
    margin: 20,
  },
  input: {
    color: Colors.white,
    borderColor: Colors.white,
  },
  lastElement: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    margin: 20,
  },
  logo: {
    paddingTop: 100,
  },
  logoText: {
    color: Colors.white,
    fontSize: 50,
    textAlign: 'center',
  },
});
