import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from "react-native";
import Colors from "../constants/Colors";
import Dots from "./Dots";

export default class PassCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            confirmation: '',
            codeLength: props.codeLength || 4,
            codeEntered: false,
            hasError: false
        };
        this.numbers = [];
        this.setup();
    }

    setup() {
        for (let i = 0; i < 9; i++) {
            this.numbers.push(
                <TouchableOpacity key={i + 1}
                                  onPress={() => this.handlePress(i+1)}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{i+1}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        this.numbers.push(
            <TouchableOpacity key={0}
                              onPress={() => this.handlePress(0)}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>0</Text>
                </View>
            </TouchableOpacity>
        );
    }

    async handlePress(num) {
        const code = this.state.code + num;
        await this.setState({...this.state, ...{code}});
        if (code.length === this.state.codeLength) {
            this.codeEntered()
        }
    }

    codeEntered() {
        if (this.props.confirmNeeded) {
            const code1 = this.state.code;
            const code2 = this.state.confirmation;
            if (!code2) {
                this.setState({...this.state, ...{code: '', confirmation: this.state.code}});
            } else if (code1.length !== this.state.codeLength ||
                code2.length !== this.state.codeLength ||
                code1 !== code2) {
                this.setState({...this.state, ...{code: '', confirmation: ''}});
                this.hasError(true);
            } else {
                this.setState({...this.state, ...{codeEntered: true}});
                this.props.codeEntered(this.state.code);
            }
        } else if (this.props.passCode && this.props.passCode !== this.state.code) {
            setTimeout(() => this.setState({...this.state, ...{code: '', confirmation: ''}}), 300)
            this.hasError(true);
        } else {
            this.setState({...this.state, ...{codeEntered: true}});
            this.props.codeEntered(this.state.code);
        }
    }

    hasError(hasError) {
        this.setState({...this.state, ...{hasError}});
    }

    render() {
        const numbers = new Array(9);

        return (
            <View style={{...styles.container,
                ...(this.props.backgroundColor ?
                    {backgroundColor: this.props.backgroundColor} :
                    {})}}>
                <Dots
                    num={this.state.code.length}
                    maxNum={this.state.codeLength}
                    codeEntered={this.state.codeEntered}
                    hasError={this.state.hasError}
                    endError={() => this.hasError(false)}/>
                <View style={styles.buttonHolder}>
                    {this.numbers}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: Colors.primaryBackground
   },
    buttonHolder: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 240,
        marginVertical: 20
    },
    button: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        margin: 5
    },
    buttonText: {
       color: Colors.white,
        fontSize: 20
    }
});





