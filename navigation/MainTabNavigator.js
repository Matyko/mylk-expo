import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import JournalScreen from '../screens/JournalScreen';
import Colors from '../constants/Colors';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: {
    activeTintColor: Colors.primaryBackground,
    backgroundColor: Colors.white,
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-hand` : 'md-hand'} />
  ),
};

HomeStack.path = '';

const TaskStack = createStackNavigator(
  {
    Tasks: TasksScreen,
  },
  config
);

TaskStack.navigationOptions = {
  tabBarLabel: 'Tasks',
  tabBarOptions: {
    activeTintColor: Colors.primaryBackground,
    backgroundColor: Colors.white,
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-clipboard' : 'md-clipboard'} />
  ),
};

TaskStack.path = '';

const JournalStack = createStackNavigator(
  {
    Journal: JournalScreen,
  },
  config
);

JournalStack.navigationOptions = {
  tabBarLabel: 'Journal',
  tabBarOptions: {
    activeTintColor: Colors.primaryBackground,
    backgroundColor: Colors.white,
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'} />
  ),
};

JournalStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarOptions: {
    activeTintColor: Colors.primaryBackground,
    backgroundColor: Colors.white,
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack: TaskStack,
  JournalStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
