import React, { Component } from "react";
import {CheckBox, Input} from 'react-native-elements';
import {View, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import FancyButton from "./FancyButton";
import EmojiAddon from "./EmojiAddon";

export default class TaskEditor extends Component {
    constructor(props) {
        super(props);
        if (props.task) {
            this.state = {
                mode: props.task.isFullDay ? 'date' : 'datetime',
                date: props.task.date || formatDate(new Date),
                title: props.task.title || '',
                errors: {
                    desc: ''
                },
            };
        } else {
            this.state = {
                mode: 'date',
                date: formatDate(new Date),
                title: '',
                errors: {
                    desc: ''
                },
            };
        }
    }

    changeMode() {
        const copy = JSON.parse(JSON.stringify(this.state));
        copy.mode = copy.mode === 'date' ? 'datetime' : 'date';
        this.setState(copy);
    }

    setDate(date) {
        this.setState({...this.state, ...{date: date}});
    }

    setText(text) {
        this.setState({...this.state, ...{title: text}})
    }

    saveTask() {
        let task = {
            title: this.state.title,
            date: this.state.date,
            created_at: new Date(),
            isFullDay: this.state.mode === 'date'
        };
        if (this.props.task) {
           task = {...this.props.task, ...task};
        }
        mLogger(`saving task: ${task}`);
        this.props.saveTask(task);
    }

    render() {
        const currentDate = formatDate(new Date());
        return (
            <View style={styles.container}>
                <View style={styles.formElement}>
                    <DatePicker
                        style={styles.datePicker}
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
                                borderBottomColor: Colors.light
                            }
                        }}
                        onDateChange={date => this.setDate(date)}
                    />
                </View>
                <View style={styles.formElement}>
                    <EmojiAddon
                        name="pencil">
                        <Input
                            placeholder='Enter task description...'
                            errorMessage={this.state.errors.desc}
                            value={this.state.title}
                            onChangeText={text => this.setText(text)}
                        />
                    </EmojiAddon>
                </View>
                <View style={styles.formElement}>
                    <CheckBox
                        checked={this.state.mode === 'date'}
                        containerStyle={{backgroundColor: Colors.transparent, borderColor: Colors.transparent}}
                        checkedColor={Colors.primaryBackground}
                        onPress={() => this.changeMode()}
                        title="All day"
                    />
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
    },
    formElement: {
      justifyContent: 'center',
      flexBasis: 1,
      flexShrink: 0,
      flexGrow: 0,
      marginHorizontal: 20,
      marginVertical: 50
    },
    datePicker: {
        flexGrow: 1,
        height: 30,
        width: 200,
    },
    lastElement: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        margin: 20
    }
});

