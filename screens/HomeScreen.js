import React, { Component } from 'react';
import {
    AsyncStorage,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import NotificationManager from "../util/NotificationManager";
import mLogger from "../util/mLogger";
import Colors from "../constants/Colors";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    };
    this.props.navigation.addListener('willFocus', () => this.getTasks())
  }

  getTasks() {
      try {
          mLogger('Loading tasks');
          AsyncStorage.getItem('tasks').then(result => {
              const tasks = result ? JSON.parse(result) : [];
              this.setState({...this.state, ...{tasks}})
          })
      } catch {
          Alert.alert('Could not load your tasks');
          mLogger('could not load tasks')
      }
  }

  componentWillMount() {
      this.getTasks();
  }

  render() {
  const { navigate } = this.props.navigation;
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <NotificationManager/>
                <TouchableOpacity
                    style={styles.infoPill}>
                    <Text style={styles.infoPillText}>Today is: {new Date().toDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoPill}
                    onPress={() => navigate('Tasks')}>
                    <Text style={styles.infoPillText}>
                        You have {this.state.tasks.length ? this.state.tasks.length : 'no' } task{this.state.tasks.length !== 1 && 's'} for today.
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoPill}
                    onPress={() => navigate('Journal')}>
                    <Text style={styles.infoPillText}>
                        You did not add a new page for today to your Journal yet.
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 20
  },
  infoPill: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    backgroundColor: Colors.primaryBackground,
    marginBottom: 20,
    ...Platform.select({
        ios: {
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: -3
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
        android: {
            elevation: 1
        }
    }),
  },
  infoPillText: {
    color: Colors.primaryText
  }
});
