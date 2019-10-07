import React, { Component } from "react";
import {Input} from 'react-native-elements';
import {View, StyleSheet, Picker, Text, Platform, Animated} from "react-native";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import { Ionicons } from "@expo/vector-icons";
import {Task} from "../models/Task";
import DateTimePicker from "./DateTimePicker";

export default class TaskEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: props.task && props.task.isFullDay ? 'date' : 'datetime' || 'date',
            date: props.task && props.task.date || formatDate(new Date),
            title: props.task && props.task.title || '',
            repeats: props.task && props.task.repeats || null,
            animVal: new Animated.Value(0),
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

    open() {
        Animated.spring(this.state.animVal, {
            toValue: 1
        }).start()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const state = {
            mode: this.props.task && this.props.task.isFullDay ? 'date' : 'datetime' || 'date',
            date: this.props.task && this.props.task.date || formatDate(new Date),
            title: this.props.task && this.props.task.title || '',
            repeats: this.props.task && this.props.task.repeats || null
        };
        this.setState({...this.state, ...state});
        console.log(this.state);
    }

    close() {
        Animated.spring(this.state.animVal, {
            toValue: 0
        }).start()
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
        this.close();
    }

    render() {
        const style = [{maxHeight: this.state.animVal.interpolate({inputRange:[0,1], outputRange:[0,50]})}];
        return (
            <View style={styles.container}>
                <View style={styles.formRow}>
                    <View style={styles.formElement}>
                        {/*<Text style={styles.label}>Task description</Text>*/}
                        <Input
                            placeholder='Enter task description...'
                            errorMessage={this.state.errors.desc}
                            value={this.state.title}
                            onChangeText={text => this.setText(text)}
                            placeholderTextColor={Colors.primaryText}
                            inputContainerStyle={{borderColor: Colors.primaryText}}
                            inputStyle={{color: Colors.primaryText}}
                            onFocus={() => this.open()}
                        />
                    </View>
                    <View style={styles.saveButton}>
                        <Ionicons
                            name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}
                            size={35}
                            color={Colors.primaryText}
                            onPress={() => this.saveTask()}/>
                    </View>
                </View>
                <Animated.View style={[styles.formRow, style]}>
                    <View style={[styles.formElement, {flexGrow: 2}]}>
                        {/*<Text style={styles.label}>Date</Text>*/}
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <DateTimePicker
                                onDateChange={date => this.setDate(date)}
                                textColor={Colors.primaryText}
                                borderColor={Colors.primaryText}
                                mode={this.state.mode}/>
                        </View>
                    </View>
                    <View style={[styles.formElement, {flexGrow: 1, marginBottom: 10}]}>
                        {/*<Text style={styles.label}>Repeats</Text>*/}
                            <Picker
                                style={{color: Colors.primaryText}}
                                selectedValue={this.state.repeats}
                                onValueChange={repeats => this.setState({...this.state, ...{repeats}})}>
                                <Picker.Item label="Never" value={null} />
                                <Picker.Item label="Daily" value="day" />
                                <Picker.Item label="Weekly" value="week" />
                                <Picker.Item label="Monthly" value="month" />
                                <Picker.Item label="Yearly" value="year" />
                            </Picker>
                    </View>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.transparent,
        opacity: 0.8
    },
    formElement: {
      flexBasis: 1,
      flexShrink: 0,
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    formRow: {
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
    saveButton: {
        flexGrow: 0,
        minWidth: 30,
        alignItems: 'center'
    },
    label: {
        alignSelf: 'flex-start',
        padding: 5,
        color: Colors.primaryText
    }
});
