import React, { Component } from "react";
import {CheckBox, Input} from 'react-native-elements';
import {View, StyleSheet, Picker, Text} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import FancyButton from "./FancyButton";
import EmojiAddon from "./EmojiAddon";
import {Task} from "../models/Task";

export default class TaskEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: props.task && props.task.isFullDay ? 'date' : 'datetime' || 'date',
            date: props.task && props.task.date || formatDate(new Date),
            title: props.task && props.task.title || '',
            repeats: props.task && props.task.repeats || null,
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

    setDate(date) {
        this.setState({...this.state, ...{date: date}});
    }

    setRepeats() {
        const repeats = this.state.repeats ? false : 'day';
        this.setState({...this.state, ...{repeats}})
    }

    setText(text) {
        this.setState({...this.state, ...{title: text}})
    }

    async saveTask() {
        let task;
        if (this.props.task) {
            task = new Task(this.props.task);
            await task.cancelNotification();
        } else {
            task = new Task({
                title: this.state.title,
                date: this.state.date,
                isFullDay: this.state.mode === 'date',
                repeats: this.state.repeats
            })
        }
        await task.createNotification();
        mLogger(`saving task: ${task}`);
        await this.props.savedTask(await task.save());
    }

    render() {
        const currentDate = formatDate(new Date());
        return (
            <View style={styles.container}>
                <View style={styles.formElement}>
                    <Text style={styles.label}>Date</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <DatePicker
                            style={{width: '50%'}}
                            date={this.state.date}
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
                                    marginLeft: 40,
                                    flexGrow: 1,
                                    borderColor: Colors.transparent,
                                    borderBottomColor: Colors.light,
                                    color: Colors.black
                                }
                            }}
                            onDateChange={date => this.setDate(date)}
                        />
                        <CheckBox
                            checked={this.state.mode === 'date'}
                            containerStyle={{backgroundColor: Colors.transparent, borderColor: Colors.transparent}}
                            checkedColor={Colors.primaryBackground}
                            onPress={() => this.changeMode()}
                            title="All day"
                        />
                    </View>
                </View>
                <View style={styles.formElement}>
                    <Text style={styles.label}>Task description</Text>
                    <EmojiAddon
                        name="pencil">
                        <Input
                            placeholder='Enter task description...'
                            errorMessage={this.state.errors.desc}
                            value={this.state.title}
                            onChangeText={text => this.setText(text)}
                            inputStyle={{color: Colors.black}}
                        />
                    </EmojiAddon>
                </View>
                <View style={styles.formElement}>
                    <Text style={styles.label}>Repeats</Text>
                    <EmojiAddon
                        name="timer_clock">
                        <Picker
                            style={{flexGrow: 1, color: Colors.black}}
                            selectedValue={this.state.repeats}
                            onValueChange={repeats => this.setState({...this.state, ...{repeats}})}>
                            <Picker.Item label="Never" value={null} />
                            <Picker.Item label="Daily" value="day" />
                            <Picker.Item label="Weekly" value="week" />
                            <Picker.Item label="Monthly" value="month" />
                            <Picker.Item label="Yearly" value="year" />
                        </Picker>
                    </EmojiAddon>
                </View>
                <View style={styles.lastElement}>
                    <FancyButton
                        title="Save"
                        pressFn={() => this.saveTask()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
    },
    formElement: {
      flexBasis: 1,
      flexShrink: 0,
      flexGrow: 0,
      marginVertical: 30,
      width: '100%',
      minHeight: 30,
      justifyContent: 'space-between'
    },
    lastElement: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        margin: 20
    },
    label: {
        paddingVertical: 5,
        color: Colors.black
    }
});
