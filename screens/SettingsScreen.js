import React, { Component } from 'react';
import {View, StyleSheet, Text, Switch, AsyncStorage, ScrollView} from "react-native";
import Colors from "../constants/Colors";
import * as SecureStore from "expo-secure-store";
import PassCode from "../components/PassCode";
import ModalComponent from "../components/ModalComponent";

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPassCode: false,
      showPassCodeModal: false
    }
  }

  async componentWillMount() {
    const passCode = await SecureStore.getItemAsync('passCode');
    this.setState({...this.state, ...{hasPassCode: !!passCode}});
  }

  setPassCode(setPasscode) {
    if (setPasscode) {
      this.setState({...this.state, ...{showPassCodeModal: true}});
    } else {
      SecureStore.deleteItemAsync('passCode').then(() => {
        this.setState({...this.state, ...{hasPassCode: false}});
      })
    }
  }

  savePassCode(code) {
    SecureStore.setItemAsync('passCode', code).then(() => {
      this.setState({...this.state, ...{hasPassCode: true, showPassCodeModal: false}});
    })
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
              </View>
            </View>
          </ScrollView>
          <ModalComponent
              closeModal={() => this.setState({showPassCodeModal: false})}
              modalVisible={this.state.showPassCodeModal}
              title="Enter passcode"
          >
            <PassCode
                confirmNeeded={true}
                codeEntered={code => this.savePassCode(code)}/>
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
    flex: 1
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
    paddingHorizontal: 22,
    alignItems: 'center'
  },
  settingsSection: {
    flexGrow: 1,
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
    flexGrow: 1
  },
  footerText: {
    flexGrow: 0,
    lineHeight: 79,
    color: Colors.white
  }
});
