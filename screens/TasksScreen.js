import React, {Component} from 'react';
import {AsyncStorage, ScrollView, StyleSheet, Text, View,} from 'react-native';
import ModalComponent from "../components/ModalComponent";
import TaskElement from "../components/TaskElement";
import FloatingActionButton from "../components/FloatingActionButton";
import TaskEditor from "../components/TaskEditor";
import Colors from "../constants/Colors";
import sortByDate from "../util/sortByDate";
import mLogger from "../util/mLogger";
import NotificationManager from "../util/NotificationManager"
import parseDate from "../util/parseDate";

export default class TasksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            modalVisible: false,
            editedTask: null
        };
        this.notificationManager = new NotificationManager;
    }

    async componentWillMount() {
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

    async setChecked(task) {
        if (task.checked) {
            task._notificationId = await this.notificationManager.createNotification({
                title: 'Task alert',
                body: task.title,
                time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0)
            });
        } else {
            await this.notificationManager.cancelNotification(task._notificationId);
        }
        const tasks = this.state.tasks.map(e => {
            if (e === task) {
                e.checked = !e.checked
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
        task.id = tasks.length;
        task._notificationId = await this.notificationManager.createNotification({
            title: 'Task alert',
            body: task.title,
            time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0)
        });
        tasks.push(task);
        await this.updateTasks(tasks);
    }

    async updateTask(task) {
        await this.notificationManager.cancelNotification(task._notificationId);
        task._notificationId = await this.notificationManager.createNotification({
            title: 'Task alert',
            body: task.title,
            time: parseDate(task.date) + (task.isFullDay ? 25200000 : 0)
        });
        const tasks = this.state.tasks.map(e => {
            if (e.id === task.id) {
                return task;
            }
            return e;
        });
        await this.updateTasks(tasks)
    }

    async deleteTask(task) {
        const tasks = this.state.tasks.filter(e => e !== task);
        await this.notificationManager.cancelNotification(task._notificationId);
        await this.updateTasks(tasks)
    }

    async updateTasks(tasks) {
        console.log(tasks);
        const state = {...this.state, ...{tasks, modalVisible: false}};
        console.log(state);
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
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
                                key={task.id}
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
                                key={task.id}
                                task={task}
                                setChecked={() => this.setChecked(task)}
                                deleteTask={() => this.deleteTask(task)}/>
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
