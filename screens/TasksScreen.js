import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ModalComponent from "../components/ModalComponent";
import TaskElement from "../components/TaskElement";
import FloatingActionButton from "../components/FloatingActionButton";
import TaskEditor from "../components/TaskEditor";
import Colors from "../constants/Colors";
import sortByDate from "../util/sortByDate";
import mLogger from "../util/mLogger";
import NotificationManager from "../util/NotificationManager"
import parseDate from "../util/parseDate";
import PageAutomator from "../util/PageAutomator";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';

export default class TasksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            modalVisible: false,
            editedTask: null
        };
        this.notificationManager = new NotificationManager;
        this.pageAutomator = new PageAutomator;
    }

    async componentWillMount() {
        try {
            mLogger('Loading tasks');
            Storage.getItem(STORAGE_CONSTS.TASKS).then(result => {
                const tasks = result ? JSON.parse(result) : [];
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
            task.finishedDay = new Date(new Date().toDateString()).getTime();
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

    async saveTask(task) {
        if (task.hasOwnProperty('id')) {
            await this.updateTask(task)
        } else {
            await this.createTask(task)
        }
    }

    async createTask(task) {
        const tasks = this.state.tasks.slice();
        task._id = new Date().getTime().toString() + tasks.length;
        const currentTime = new Date().getTime();
        const dueTime = parseDate(task.date);
        if (currentTime < dueTime) {
            task._notificationId = await this.notificationManager.createNotification({
                title: 'Mylk task reminder',
                body: task.title,
                time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0),
                repeats: task.repeats
            });
        }
        tasks.push(task);
        await this.updateTasks(tasks);
    }

    async updateTask(task) {
        if (task._notificationId) {
            await this.notificationManager.cancelNotification(task._notificationId);
        }
        task._notificationId = await this.notificationManager.createNotification({
            title: 'Mylk task reminder',
            body: task.title,
            time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0),
            repeat: task.repeat
        });
        const tasks = this.state.tasks.map(e => {
            if (e._id === task._id) {
                return task;
            }
            return e;
        });
        await this.updateTasks(tasks)
    }

    async deleteTask(task) {
        if (task.checked) {
            await this.setChecked(task);
        }
        if (task._notificationId) {
            await this.notificationManager.cancelNotification(task._notificationId);
        }
        try {
            await Storage.deleteListItem(STORAGE_CONSTS.TASKS, this.state.tasks, task);
            const tasks = this.state.tasks.filter(e => e !== task);
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
            Alert.alert('Could not delete your task');
        }
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
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
                <ModalComponent
                    closeModal={() => this.setState({...this.state, ...{modalVisible: false, editedTask: null}})}
                    modalVisible={this.state.modalVisible}
                    title="Create a task"
                >
                    <TaskEditor task={this.state.editedTask}
                                saveTask={task => this.saveTask(task)}/>
                </ModalComponent>
                <PageAutomator/>
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
        fontWeight: 'bold',
    },
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
