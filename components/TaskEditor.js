import React, { Component } from "react";
import {CheckBox, Input, Button} from 'react-native-elements';
import {View, Text, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import Emoji from "react-native-emoji";

export default class TaskEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'date',
            date: formatDate(new Date),
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

    setDate(date) {
        this.setState({...this.state, ...{date: date}});
    }

    setText(text) {
        this.setState({...this.state, ...{title: text}})
    }

    createTask() {
        const task = {
            title: this.state.title,
            date: this.state.date,
            created_at: new Date()
        };
        mLogger(`saving task: ${task}`);
        this.props.createTask(task);
    }

    render() {
        const currentDate = formatDate(new Date());
        return (
            <View style={styles.container}>
                <View style={styles.formElement}>
                    <Text style={styles.fontStyling}>Create new task</Text>
                </View>
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
                                marginLeft: 36,
                                flexGrow: 1,
                                borderColor: Colors.transparent,
                                borderBottomColor: Colors.light
                            }
                        }}
                        onDateChange={date => this.setDate(date)}
                    />
                </View>
                <View style={styles.addonEmojiHolder}>
                    <Emoji name="pencil" style={styles.addonEmoji}/>
                    <Input
                        style={styles.hasAddonEmoji}
                        placeholder='Enter task description'
                        errorMessage={this.state.errors.desc}
                        onChangeText={text => this.setText(text)}
                    />
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
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
    },
    formElement: {
      flexGrow: 0,
      margin: 20
    },
    addonEmojiHolder: {
      margin: 20,
      flexGrow: 0,
      flexDirection: 'row'
    },
    addonEmoji: {
        flexGrow: 0,
        fontSize: 25
    },
    hasAddonEmoji: {
        flexGrow: 1,
        marginLeft: 10
    },
    datePicker: {
        flexGrow: 0,
        height: 30
    },
    fontStyling: {
        fontWeight: 'bold',
        fontSize: 20,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    lastElement: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        margin: 20
    },
    button: {
        borderColor: Colors.primaryBackground,
        color: Colors.primaryBackground,
        backgroundColor: Colors.transparent
    }
});

