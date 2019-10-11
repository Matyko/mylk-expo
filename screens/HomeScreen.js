import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Animated, Text, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import HomeScreenPill from '../components/HomeScreenPill';
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import { Task } from '../models/Task';
import { Page } from '../models/Page';
import { getAllStatic } from '../models/BaseModel';
import HomeScreenTopElement from "../components/HomeScreenTopElement";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      pages: [],
    };
    this.animVal1 = new Animated.Value(0);
    this.animVal2 = new Animated.Value(0);
    this.animVal3 = new Animated.Value(0);
    this.props.navigation.addListener('willFocus', () => {
      this.getData();
    });
    // this.initSync();
  }

  async initSync() {
    const toSync = await Storage.getItem(STORAGE_CONSTS.SYNC);
    if (toSync) {
      await Storage.setUpSynced();
      await Storage.syncAll();
    }
  }

  getData() {
    const data = [
      { type: STORAGE_CONSTS.PAGES, classType: Page, stateName: 'pages' },
      { type: STORAGE_CONSTS.TASKS, classType: Task, stateName: 'tasks' },
    ];

    data.forEach(async ({ type, classType, stateName }) => {
      try {
        let array = await getAllStatic(type, classType);
        const today = new Date(new Date().toDateString());
        array = array.filter(element => {
          const eDate = new Date(new Date(+element.timeStamp).toDateString());
          return !element.checked && today.getTime() === eDate.getTime();
        });
        this.setState({ ...this.state, ...{ [stateName]: array } });
      } catch (e) {
        Alert.alert(`Could not load your ${type.toLowerCase()}`);
      }
    });
  }

  componentWillMount() {
    this.getData();
  }

  componentDidMount() {
    Animated.spring(this.animVal1, {
      toValue: 1,
      speed: 1,
      useNativeDriver: true,
    }).start();
    Animated.spring(this.animVal2, {
      toValue: 1,
      speed: 1,
      delay: 200,
      useNativeDriver: true,
    }).start();
    Animated.spring(this.animVal3, {
      toValue: 1,
      speed: 1,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const { navigate } = this.props.navigation;
    const style = index => {
      return {
        transform: [
          {
            scale: this[`animVal${index + 1}`].interpolate({
              inputRange: [0, 1],
              outputRange: [0.01, 1],
            }),
          },
        ],
      };
    };
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Animated.View style={style(0)}>
            <HomeScreenTopElement/>
          </Animated.View>
          <Animated.View style={style(1)}>
            <HomeScreenPill
              handlePress={() => navigate('Tasks')}
              text={`You have ${this.state.tasks.length ? this.state.tasks.length : 'no'} task${
                this.state.tasks.length !== 1 ? 's' : ''
              } for today.`}
              icon={'clipboard'}
              count={this.state.tasks.length}
            />
          </Animated.View>
          <Animated.View style={style(2)}>
            <HomeScreenPill
              handlePress={() => navigate('Journal')}
              text={`You have added ${
                this.state.pages.length ? this.state.pages.length : 'no'
              } page${this.state.pages.length !== 1 ? 's' : ''} for today to your Journal.`}
              icon={'journal'}
              count={this.state.pages.length}
            />
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
  headerStyle: {
    backgroundColor: '#f4511e',
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
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    color: Colors.primaryBackground,
    textAlign: 'center',
    margin: 5,
  },
});
