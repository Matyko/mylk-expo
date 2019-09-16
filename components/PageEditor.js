import React, { Component } from "react";
import {Input, Button} from 'react-native-elements';
import {View, Text, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import ImagePickerComponent from "./ImagePickerComponent";

export default class PageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'date',
            date: formatDate(new Date),
            text: '',
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
        this.setState({...this.state, ...{text: text}})
    }

    createTask() {
        const task = {
            text: this.state.text,
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
                <ImagePickerComponent/>
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
                                borderColor: 'transparent',
                                borderBottomColor: Colors.light
                            }
                        }}
                        onDateChange={date => this.setDate(date)}
                    />
                </View>
                <View style={styles.formElement}>
                    <Input
                        placeholder='Enter task description'
                        errorMessage={this.state.errors.desc}
                        multiline={true}
                        numberOfLines={8}
                        onChangeText={text => this.setText(text)}
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
        paddingTop: 10,
        paddingVertical: 20,
    },
    formElement: {
        margin: 20
    },
    datePicker: {
        width: 200,
        height: 30
    },
    fontStyling: {
        fontWeight: 'bold',
        fontSize: 20,
        textTransform: 'uppercase',
        letterSpacing: 1}
});

