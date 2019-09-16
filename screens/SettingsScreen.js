import React from 'react';
import {View, StyleSheet, Text, Switch} from "react-native";
import Colors from "../constants/Colors";

export default function SettingsScreen() {
  return (
      <View style={styles.container}>
        <View style={styles.settingsContent}>
          <View style={styles.settingsElement}>
            <Text style={styles.settingsTitle}>
              Something to set
            </Text>
            <View style={styles.functionality}>
              <Switch/>
            </View>
          </View>
        </View>
        <View style={styles.settingsFooter}>
          <Text style={styles.footerText}>Mylk by Matyi</Text>
        </View>
      </View>
  )
}

SettingsScreen.navigationOptions = {
  title: 'Settings',
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
    backgroundColor: Colors.primaryBackground
  },
  settingsElement: {
    flexDirection: 'row'
  },
  functionality: {
    flexGrow: 0,
    width: 100
  },
  settingsTitle: {
    flexGrow: 1
  },
  footerText: {
    lineHeight: 79,
    color: Colors.white
  }
});
