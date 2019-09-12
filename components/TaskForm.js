import React, { Component } from "react";
import {CheckBox, Input, Button} from 'react-native-elements';
import {View, Text, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";

export default class TaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'date',
            date: new Date,
            title: '',
            errors: {
                desc: ''
            },
        };
    }

    changeMode() {
        const copy = JSON.parse(JSON.stringify(this.state));
        copy.mode = copy.mode === 'date' ? 'datetime' : 'date';
        this.setState(copy);
    }

    createTask() {
        const task = {
            title: this.state.title,
            due: this.state.date,
            created_at: new Date()
        };
        this.props.createTask(task);
    }

    render() {
        const currentDate = formatDate(new Date());
        return (
            <View style={styles.container}>
                <View style={styles.formElement}>
                    <Text>Create new task</Text>
                </View>
                <View style={styles.formElement}>
                    <DatePicker
                        style={{backgroundColor: 'black'}}
                        date={'2016-06-06'}
                        mode={this.state.mode}
                        placeholder="select date"
                        format={`YYYY-MM-DD${this.state.mode === 'datetime' ? ' HH:mm' : ''}`}
                        minDate={currentDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                                flexGrow: 1,
                                borderColor: 'transparent',
                                borderBottomColor: Colors.light
                            }
                        }}
                        onDateChange={date => this.setState({...this.state, ...{date: date}})}
                    />
                </View>
                <View style={styles.formElement}>
                    <Input
                        placeholder='Enter task description'
                        errorMessage={this.state.errors.desc}
                        onChangeText={text => this.setState({...this.state, ...{title: text}})}
                    />
                </View>
                <View style={styles.formElement}>
                    <CheckBox
                        checked={this.state.mode === 'date'}
                        onPress={() => this.changeMode()}
                        title="All day"
                    />
                </View>
                <View style={styles.formElement}>
                    <Button
                        title="Save"
                        type="outline"
                        onPress={() => this.createTask()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },
    formElement: {
        margin: 20
    }
});

