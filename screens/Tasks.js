import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TaskElement from "../components/TaskElement";
import FloatingActionButton from "../components/FloatingActionButton";

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    }
  }

  setChecked(task) {
    this.setState({tasks: this.state.tasks.map(e => {
        if (e === task) {
          e.checked = !e.checked
        }
        return e;
      })
    })
  }

  addTask() {
    const newTasks = this.state.tasks.slice();
    newTasks.concat([{id: newTasks.length, title: `Task #${newTasks.length}`, due: new Date()}]);
    this.setState({tasks: newTasks});
  }

  render() {
    return (
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
          <View>
            <Text>Checked items</Text>
            <View style={styles.separator}/>
          </View>
          {this.state.tasks.map(task => {
            if (task.checked) {
              return <TaskElement
                  key={task.id}
                  task={task}
                  setChecked={() => this.setChecked(task)}/>
            } else {
              return null;
            }
          })}
          <FloatingActionButton pressFunction={() => this.addTask()}/>
        </ScrollView>
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
