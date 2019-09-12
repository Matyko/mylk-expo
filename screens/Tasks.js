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
import TaskForm from "../components/TaskForm";

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      modalVisible: false
    }
  }

  componentWillMount() {
    try {
      AsyncStorage.getItem('tasks').then(result => {
        const tasks = result ? JSON.parse(result) : [];
        this.setState({tasks, modalVisible: false})
      })
    } catch {
      Alert.alert('Could not load your tasks')
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
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      this.setState({tasks: newTasks, modalVisible: false});
    } catch {
      Alert.alert('Could not save your tasks')
    }

  }

  async createTask(task) {
    const newTasks = this.state.tasks.slice();
    task.id = newTasks.length;
    newTasks.push(task);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      this.setState({tasks: newTasks, modalVisible: false});
    } catch {
      Alert.alert('Could not save your tasks')
    }
  }

  render() {
    return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.container}>
            {this.state.tasks.map(task => {
              if (!task.checked) {
                return <TaskElement
                    key={task.id}
                    task={task}
                    setChecked={() => this.setChecked(task)}/>
              } else {
                return null;
              }
            })}
            {!!this.state.tasks.filter(e => e.checked).length &&
              <View>
              <Text>Checked items</Text>
              <View style={styles.separator}/>
            </View>}
            {this.state.tasks.map(task => {
              if (task.checked) {
                return <TaskElement
                    style={{opacity: 0.6}}
                    key={task.id}
                    task={task}
                    setChecked={() => this.setChecked(task)}/>
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
            <TaskForm createTask={task => this.createTask(task)}/>
          </ModalComponent>
        </View>
    );
  }
}

Tasks.navigationOptions = {
  title: 'Tasks',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray'
  }
});
