import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import TaskElement from '../components/TaskElement';
import FloatingActionButton from '../components/FloatingActionButton';
import TaskEditor from '../components/TaskEditor';
import Colors, { hexToRgb } from '../constants/Colors';
import sortByDate from '../util/sortByDate';
import mLogger from '../util/mLogger';
import NotificationManager from '../util/NotificationManager';
import PageAutomator from '../util/PageAutomator';
import STORAGE_CONSTS from '../util/storageConsts';
import { Task } from '../models/Task';
import { getAllStatic } from '../models/BaseModel';

const rgbBG = hexToRgb(Colors.primaryBackground);

export default class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      modalVisible: false,
      editedTask: null,
    };
    this.notificationManager = new NotificationManager();
    this.pageAutomator = new PageAutomator();
  }

  async componentWillMount() {
    try {
      mLogger('Loading tasks');
      const tasks = await getAllStatic(STORAGE_CONSTS.TASKS, Task);
      this.setState({ ...this.state, ...{ tasks } });
    } catch (e) {
      Alert.alert('Could not load your tasks');
      mLogger('could not load tasks');
    }
  }

  async setChecked(task) {
    task = new Task(task);
    if (task.checked) {
      const currentTime = new Date().getTime();
      const dueTime = task.timeStamp;
      if (currentTime < dueTime && !task.repeats) {
        task._notificationId = await this.notificationManager.createNotification({
          title: 'Mylk task reminder',
          body: task.title,
          time: task.timeStamp,
        });
      }
      await this.pageAutomator.taskUnChecked(task);
    } else {
      task.finishedDay = new Date(new Date().toDateString()).getTime();
      await this.pageAutomator.taskChecked(task);
      if (task._notificationId && !task.repeats) {
        await this.notificationManager.cancelNotification(task._notificationId);
        delete task._notificationId;
      }
    }
    task.finishedDay = !task.checked ? new Date(new Date().toDateString()).getTime() : null;
    task.checked = !task.checked;
    const tasks = await task.save();
    const state = { ...this.state, ...{ tasks, modalVisible: false } };
    this.setState(state);
  }

  editTask(task) {
    this.setState({ ...this.state, ...{ modalVisible: true, editedTask: task } });
  }

  async savedTask(tasks) {
    this.setState({ ...this.state, ...{ tasks, modalVisible: false, editedTask: null } });
  }

  async deleteTask(task) {
    if (task.checked) {
      await this.setChecked(task);
    }
    const taskObj = new Task(task);
    try {
      const tasks = await taskObj.remove();
      const state = { ...this.state, ...{ tasks, modalVisible: false } };
      this.setState(state);
    } catch (e) {
      Alert.alert('Could not delete your task');
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flexGrow: 0, backgroundColor: `rgba(${rgbBG.r},${rgbBG.g},${rgbBG.b},0.8)` }}>
          <TaskEditor task={this.state.editedTask} savedTask={tasks => this.savedTask(tasks)} />
        </View>
        <ScrollView
          style={{ flexGrow: 2, backgroundColor: `rgba(${rgbBG.r},${rgbBG.g},${rgbBG.b},0.6)` }}>
          {this.state.tasks.sort(sortByDate).map(task => {
            if (!task.checked) {
              return (
                <TaskElement
                  key={task._id}
                  task={task}
                  setChecked={() => this.setChecked(task)}
                  deleteTask={() => this.deleteTask(task)}
                  toEdit={() => this.editTask(task)}
                />
              );
            } else {
              return null;
            }
          })}
          {!!this.state.tasks.filter(e => e.checked).length && (
            <View>
              <Text style={styles.separatorTitle}>Checked items</Text>
              <View style={styles.separator} />
            </View>
          )}
          {this.state.tasks.sort(sortByDate).map(task => {
            if (task.checked) {
              return (
                <TaskElement
                  key={task._id}
                  task={task}
                  setChecked={() => this.setChecked(task)}
                  deleteTask={() => this.deleteTask(task)}
                  toEdit={() => this.editTask(task)}
                />
              );
            } else {
              return null;
            }
          })}
        </ScrollView>
        <FloatingActionButton
          pressFunction={() => this.setState({ ...this.state, ...{ modalVisible: true } })}
        />
      </View>
    );
  }
}

TasksScreen.navigationOptions = {
  title: 'Tasks',
  headerStyle: {
    backgroundColor: Colors.primaryBackground,
    height: 79,
  },
  headerTitleStyle: {
    color: Colors.primaryText,
    lineHeight: 79,
    fontFamily: 'nunito-black',
    fontWeight: 'normal',
  },
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.light,
    marginHorizontal: 20,
  },
  separatorTitle: {
    color: Colors.light,
    marginHorizontal: 20,
  },
});
