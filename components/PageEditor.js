import React, { Component } from "react";
import {Input, Button} from 'react-native-elements';
import {View, StyleSheet} from "react-native";
import DatePicker from "react-native-datepicker";
import formatDate from "../util/formatDate";
import Colors from "../constants/Colors";
import mLogger from "../util/mLogger";
import ImagePickerComponent from "./ImagePickerComponent";
import FancyButton from "./FancyButton";

export default class PageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: props.page ? props.page.isFullDay : 'date',
            date: props.page ? formatDate(props.page.date) : formatDate(new Date),
            text: props.page ? props.page.text : '',
            errors: {
                desc: ''
            },
        };
    }

    setDate(date) {
        this.setState({...this.state, ...{date: date}});
    }

    setText(text) {
        this.setState({...this.state, ...{text: text}})
    }

    savePage() {
        const page = {
            text: this.state.text,
            date: this.state.date,
            created_at: new Date()
        };
        mLogger(`saving task: ${page}`);
        this.props.savePage(page);
    }

    render() {
        const currentDate = formatDate(new Date());
        return (
            <View style={styles.container}>
                <View style={styles.formElement}>
                    <ImagePickerComponent/>
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
                                borderColor: 'transparent',
                                borderBottomColor: Colors.light
                            }
                        }}
                        onDateChange={date => this.setDate(date)}
                    />
                </View>
                <View style={styles.formElement}>
                    <Input
                        placeholder='How was your day...'
                        errorMessage={this.state.errors.desc}
                        multiline={true}
                        numberOfLines={8}
                        onChangeText={text => this.setText(text)}
                    />
                </View>
                <View style={styles.lastElement}>
                    <FancyButton
                        title="Save"
                        pressFn={() => this.savePage()}
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

