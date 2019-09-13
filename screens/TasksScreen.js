import React, {Component} from 'react';
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ModalComponent from "../components/ModalComponent";
import TaskElement from "../components/TaskElement";
import FloatingActionButton from "../components/FloatingActionButton";
import TaskEditor from "../components/TaskEditor";
import Colors from "../constants/Colors";
import sortByDate from "../util/sortByDate";
import mLogger from "../util/mLogger";

export default class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      modalVisible: false
    }
  }

  componentWillMount() {
    try {
      mLogger('Loading tasks');
      AsyncStorage.getItem('tasks').then(result => {
        const tasks = result ? JSON.parse(result) : [];
        this.setState({tasks, modalVisible: false})
      })
    } catch {
      Alert.alert('Could not load your tasks');
      mLogger('could not load tasks')
    }
  }

  async setChecked(task) {
    const newTasks = this.state.tasks.map(e => {
      if (e === task) {
        e.checked = !e.checked
      }
      return e
    });
    try {
      mLogger(`Updating task: ${task}`);
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      this.setState({tasks: newTasks, modalVisible: false});
    } catch {
      Alert.alert('Could not save your tasks');
      mLogger(`Could not update task: ${task}`)
    }

  }

  async createTask(task) {
    const newTasks = this.state.tasks.slice();
    task.id = newTasks.length;
    newTasks.push(task);
    try {
      mLogger(`Adding task: ${task}`);
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      this.setState({tasks: newTasks, modalVisible: false});
    } catch {
      Alert.alert('Could not save your tasks');
      mLogger(`Could not add task: ${task}`);
    }
  }

  async deleteTask(task) {
    const newTasks = this.state.tasks.filter(e => e !== task);
    try {
      mLogger(`Deleting task: ${task}`);
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      this.setState({tasks: newTasks, modalVisible: false});
    } catch {
      Alert.alert('Could not delete your task');
      mLogger(`Could not delete task: ${task}`);
    }
  }

  render() {
    return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.container}>
            {this.state.tasks.sort(sortByDate).map(task => {
              if (!task.checked) {
                return <TaskElement
                    key={task.id}
                    task={task}
                    setChecked={() => this.setChecked(task)}
                    deleteTask={() => this.deleteTask(task)}/>
              } else {
                return null;
              }
            })}
            {!!this.state.tasks.filter(e => e.checked).length &&
              <View>
              <Text style={styles.separatorTitle}>Checked items</Text>
              <View style={styles.separator}/>
            </View>}
            {this.state.tasks.sort(sortByDate).map(task => {
              if (task.checked) {
                return <TaskElement
                    key={task.id}
                    task={task}
                    setChecked={() => this.setChecked(task)}
                    deleteTask={() => this.deleteTask(task)}/>
              } else {
                return null;
              }
            })}
          </ScrollView>
          <FloatingActionButton pressFunction={() => this.setState({modalVisible: true})}/>
          <ModalComponent
              closeModal={() => this.setState({modalVisible: false})}
              modalVisible={this.state.modalVisible}
          >
            <TaskEditor createTask={task => this.createTask(task)}/>
          </ModalComponent>
        </View>
    );
  }
}

TasksScreen.navigationOptions = {
  title: 'TasksScreen',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light,
    marginHorizontal: 20
  },
  separatorTitle: {
    color: Colors.light,
    marginHorizontal: 20
  }
});
