import React, { Component } from 'react';
import {
    DatePickerAndroid,
    TimePickerAndroid,
    Platform,
    Text,
    TouchableOpacity, View, DatePickerIOS
} from "react-native";
import EmojiAddon from "./EmojiAddon";
import mLogger from "../util/mLogger";

const constants = {
    TODAY: 'Today',
    TOMORROW: 'Tomorrow'
}

export default class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateTime: this.props.date || new Date(),
            humanizedDate: '',
            humanizedTime: '',
            humanizedDateTime: ''
        };
    }

    componentDidMount() {
        this.getHumanizedData(this.state.dateTime);
    }

    getHumanizedData(date) {
        const humanizedDate = this.getHumanizedDate(date);
        const humanizedTime = this.getHumanizedTime(date);
        const humanizedDateTime = humanizedDate + " " + humanizedTime;
        this.setState({...this.state, ...{
                humanizedDate,
                humanizedTime,
                humanizedDateTime
            }})
    }

    getHumanizedDate(date) {
        if (this.isToday(date)) {
            return constants.TODAY
        } else if (this.isTomorrow) {
            return constants.TOMORROW
        } else {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        }
    }

    getHumanizedTime(date) {
        return date.getHours() + ":" + date.getMinutes()
    }

    isToday(date) {
        const today = new Date();
        return this.compareDates(today, date)
    }

    isTomorrow(date) {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return this.compareDates(tomorrow, date)
    }

    compareDates(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
    }

    startSelect() {
        const isIOS = Platform.OS === 'ios';
        console.log(isIOS);
        if (isIOS) {
            this.selectIos()
        } else {
            this.selectAndroid()
        }
    }

    selectIos() {

    }

    async selectAndroid() {
        if (this.props.mode === 'datetime' || this.props.mode === 'date') {
            try {
                const { action, year, month, day } = await DatePickerAndroid.open({
                    date: this.state.dateTime,
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    this.setDate(new Date(year, month, day));
                }
            } catch ({ code, message }) {
                mLogger('Cannot open date picker', message);
            }
        }

        if (this.props.mode === 'time') {
            try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                    hour: this.state.dateTime.getHours(),
                    minute: this.state.dateTime.getMinutes(),
                    is24Hour: true
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                    this.setDate(new Date(
                        this.state.date.getFullYear(),
                        this.state.date.getMonth(),
                        this.state.date.getDate(),
                        hour,
                        minute))
                }
            } catch ({ code, message }) {
                mLogger('Cannot open time picker', message);
            }
        }
    }

    setDate() {

    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.startSelect()}>
                    <EmojiAddon
                        name="calendar">
                        <Text>{this.props.mode === 'datetime' ?
                            this.state.humanizedDateTime :
                            this.props.mode === 'time' ?
                                this.state.humanizedTime :
                                this.state.humanizedDate }</Text>

                    </EmojiAddon>
                </TouchableOpacity>
                <DatePickerIOS date={this.state.date} mode={this.props.mode} onDateChange={this.setDate} />
            </View>
        )
    }
}
