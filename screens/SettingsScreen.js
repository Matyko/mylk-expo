import React, { Component } from 'react';
import {View, StyleSheet, Text, Switch, ScrollView, AsyncStorage, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";
import PassCode from "../components/PassCode";
import ModalComponent from "../components/ModalComponent";
import firebase from "firebase";
import * as Storage from "../util/storage";
import STORAGE_CONSTS from '../util/storageConsts';
import * as SecureStore from "expo-secure-store";

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPassCode: false,
      showPassCodeModal: false,
      passCode: null,
      syncData: true,
    }
  }

  async componentWillMount() {
    const passCode = await SecureStore.getItemAsync(STORAGE_CONSTS.PASSCODE);
    const syncData = JSON.parse(await Storage.getItem(STORAGE_CONSTS.SYNC) || 'false');
    await this.setState({...this.state, ...{hasPassCode: !!passCode, passCode, syncData}});
    this.forceUpdate();
  }

  setPassCode(setPasscode) {
    if (setPasscode) {
      this.setState({...this.state, ...{showPassCodeModal: true}});
    } else {
      this.setState({...this.state, ...{showPassCodeModal: true, removingPassCode: true}});
    }
  }

  async syncData(syncData) {
    await Storage.setItem(STORAGE_CONSTS.SYNC, syncData);
    if (syncData) {
      await Storage.syncOld();
    }
    this.setState({...this.state, ...{syncData}})
  }

  async removeSyncedData() {
    await Storage.removeSynced()
  }

  handlePassCodeEntry(code) {
    if (this.state.passCode) {
        SecureStore.deleteItemAsync(STORAGE_CONSTS.PASSCODE).then(() => {
            this.setState({...this.state, ...{hasPassCode: false, passCode: null, showPassCodeModal: false}});
        })
    } else {
        SecureStore.setItemAsync(STORAGE_CONSTS.PASSCODE, code).then(() => {
            this.setState({...this.state, ...{hasPassCode: true, showPassCodeModal: false, passCode: code}});
        })
    }
  }

  async logOut() {
    await firebase.auth().signOut();
    if (!this.state.hasPassCode) {
        await AsyncStorage.setItem(STORAGE_CONSTS.REMEMBER_ME, JSON.stringify(false));
    }
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>
            <View style={styles.settingsContent}>
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Security</Text>
                <View style={styles.settingsElement}>
                  <Text style={styles.settingsTitle}>
                    Set passcode for login
                  </Text>
                  <View style={styles.functionality}>
                    <Switch
                        value={this.state.hasPassCode}
                        onValueChange={e => this.setPassCode(e)}
                    />
                  </View>
                </View>
                <View style={styles.settingsElement}>
                  <Text style={styles.settingsTitle}>
                    Sync data to cloud
                  </Text>
                  <View style={styles.functionality}>
                    <Switch
                        value={this.state.syncData}
                        onValueChange={e => this.syncData(e)}
                    />
                  </View>
                </View>
                {/*TODO MAYBE FIREBASE FUNCTIONS*/}
                {/*<TouchableOpacity style={{...styles.settingsElement, ...styles.touchableSetting}} onPress={() => this.removeSyncedData()}>*/}
                {/*  <Text style={{...styles.settingsTitle, ...{color: Colors.primaryBackground}}}>*/}
                {/*    Remove data from cloud*/}
                {/*  </Text>*/}
                {/*</TouchableOpacity>*/}
              </View>
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Profile</Text>
                <TouchableOpacity style={{...styles.settingsElement, ...styles.touchableSetting}} onPress={() => this.logOut()}>
                  <Text style={{...styles.settingsTitle, ...{color: Colors.primaryBackground}}}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <ModalComponent
              closeModal={() => this.setState({showPassCodeModal: false})}
              modalVisible={this.state.showPassCodeModal}
              title="Enter passcode"
          >
            <PassCode
                confirmNeeded={!this.state.passCode}
                passCode={this.state.passCode}
                codeEntered={code => this.handlePassCodeEntry(code)}/>
          </ModalComponent>
        </View>
    )
  }
}

SettingsScreen.navigationOptions = {
  title: 'Settings',
  headerStyle: {
    backgroundColor: Colors.primaryBackground,
    height: 79,
  },
  headerTitleStyle: {
    color: Colors.primaryText,
    lineHeight: 79,
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  settingsContent: {
    flexGrow: 1
  },
  settingsFooter: {
    flexGrow: 0,
    height: 79,
    paddingHorizontal: 22,
    backgroundColor: Colors.primaryBackground
  },
  settingsElement: {
    flexDirection: 'row',
    marginHorizontal: 22,
    marginVertical: 4,
    padding: 12,
    alignItems: 'center'
  },
  touchableSetting: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryBackground
  },
  settingsSection: {
    flexGrow: 1,
    flexDirection: 'column'
  },
  settingsSectionTitle: {
    margin: 22,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.light,
    borderBottomColor: Colors.light,
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  functionality: {
    flexGrow: 0,
    width: 100
  },
  settingsTitle: {
    flexGrow: 1,
    color: Colors.black
  },
  footerText: {
    flexGrow: 0,
    lineHeight: 79,
    color: Colors.white
  }
});
