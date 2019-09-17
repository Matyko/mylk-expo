import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import Colors from "../constants/Colors";

export default class PassCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            confirmation: '',
            codeLength: props.codeLength || 4
        };

        this.numbers = [];
        for (let i = 0; i < 9; i++) {
            this.numbers.push(
                <TouchableOpacity onPress={() => this.handlePress(i+1)}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>{i+1}</Text>
                    </View>
                </TouchableOpacity>
            );
            this.numbers.push(
                <TouchableOpacity style={styles.buttonContainer}
                                  onPress={() => this.handlePress(0)}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>0</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    handlePress(num) {
        this.setState({...this.state, ...{code: this.state.code + num}});
        if (this.state.code.length === this.state.codeLength) {
            this.codeEntered()
        }
    }

    codeEntered() {
        if (this.props.confirmNeeded) {
            const code1 = this.state.code;
            const code2 = this.state.confirmation;
            if (code1.length !== this.state.codeLength ||
                code2.length !== this.state.codeLength ||
                code1 !== code2) {
                this.setState({...this.state, ...{code: '', confirmation: ''}});
                return;
            }
        }
        this.props.codeEntered(this.state.code);
    }



    render() {
        const numbers = new Array(9);

        return (
            <View style={styles.container}>
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
        flexWrap: 'wrap'
    },
    buttonContainer: {
       width: '32%'
    },
    button: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20
    },
    buttonText: {
       color: Colors.white
    }
});





