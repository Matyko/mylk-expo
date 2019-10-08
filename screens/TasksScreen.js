import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Alert} from 'react-native';
import ModalComponent from "../components/ModalComponent";
import TaskElement from "../components/TaskElement";
import FloatingActionButton from "../components/FloatingActionButton";
import TaskEditor from "../components/TaskEditor";
import Colors, {hexToRgb} from "../constants/Colors";
import sortByDate from "../util/sortByDate";
import mLogger from "../util/mLogger";
import NotificationManager from "../util/NotificationManager"
import parseDate from "../util/parseDate";
import PageAutomator from "../util/PageAutomator";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import {Task} from "../models/Task";

const rgbBG = hexToRgb(Colors.primaryBackground);

export default class TasksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            modalVisible: false,
            editedTask: null
        };
        this.notificationManager = new NotificationManager();
        this.pageAutomator = new PageAutomator();
    }

    async componentWillMount() {
        try {
            mLogger('Loading tasks');
            Storage.getItem(STORAGE_CONSTS.TASKS).then(result => {
                const tasks = result || [];
                this.setState({...this.state, ...{tasks}})
            })
        } catch {
            Alert.alert('Could not load your tasks');
            mLogger('could not load tasks')
        }
    }

    async setChecked(task) {
        if (task.checked) {
            const currentTime = new Date().getTime();
            const dueTime = parseDate(task.date);
            if (currentTime < dueTime && !task.repeats) {
                task._notificationId = await this.notificationManager.createNotification({
                    title: 'Mylk task reminder',
                    body: task.title,
                    time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0)
                });
            }
            await this.pageAutomator.taskUnChecked(task);
        } else {
            const today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            task.finishedDay = today.getTime();
            await this.pageAutomator.taskChecked(task);
            if (task._notificationId && !task.repeats) {
                await this.notificationManager.cancelNotification(task._notificationId);
                delete task._notificationId
            }
        }
        const tasks = this.state.tasks.map(e => {
            if (e === task) {
                e.finishedDay = !e.checked ? new Date(new Date().toDateString()).getTime() : null;
                e.checked = !e.checked;
            }
            return e
        });
        await this.updateTasks(tasks);
    }

    editTask(task) {
        this.setState({...this.state, ...{modalVisible: true, editedTask: task}})
    }

    async savedTask(tasks) {
       this.setState({...this.state, ...{tasks, modalVisible: false}})
    }

    async deleteTask(task) {
        if (task.checked) {
            await this.setChecked(task);
        }
        const taskObj = new Task(task);
        try {
            const tasks = await taskObj.remove();
            const state = {...this.state, ...{tasks, modalVisible: false}};
            this.setState(state);
        } catch {
            Alert.alert('Could not delete your task');
        }
    }

    async updateTasks(tasks) {
        const state = {...this.state, ...{tasks, modalVisible: false}};
        try {
            await Storage.setItem(STORAGE_CONSTS.TASKS, tasks);
            this.setState(state);
        } catch {
            Alert.alert('Could not update your task');
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flexGrow: 0, backgroundColor: `rgba(${rgbBG.r},${rgbBG.g},${rgbBG.b},0.8)`}}>
                    <TaskEditor task={this.state.editedTask}
                                savedTask={tasks => this.savedTask(tasks)}/>
                </View>
                <ScrollView style={{flexGrow: 2, backgroundColor: `rgba(${rgbBG.r},${rgbBG.g},${rgbBG.b},0.6)`}}>
                    {this.state.tasks.sort(sortByDate).map(task => {
                        if (!task.checked) {
                            return <TaskElement
                                key={task._id}
                                task={task}
                                setChecked={() => this.setChecked(task)}
                                deleteTask={() => this.deleteTask(task)}
                                toEdit={() => this.editTask(task)}/>
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
                                key={task._id}
                                task={task}
                                setChecked={() => this.setChecked(task)}
                                deleteTask={() => this.deleteTask(task)}
                                toEdit={() => this.editTask(task)}/>
                        } else {
                            return null;
                        }
                    })}
                </ScrollView>
                <FloatingActionButton pressFunction={() => this.setState({...this.state, ...{modalVisible: true}})}/>
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
        fontWeight: 'normal'
    },
};

const styles = StyleSheet.create({
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
