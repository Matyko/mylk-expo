import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";
import {LinearGradient} from "expo-linear-gradient";

export default class PageElement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.setState({...this.state, ...{open: !this.state.open}})}
                style={[styles.container, {maxHeight: this.state.open ? 10000 : 150}]}>
                <View style={styles.topDataContainer}>
                    {this.props.page.mood && <Text style={styles.topData}>Mood</Text>}
                    <Text style={styles.topData}>{this.props.page.date}</Text>
                </View>
                <View style={styles.images}>
                    {this.props.page.images && this.props.page.images.map(path => {
                        return <Image source={{ uri: path }} style={styles.image} />
                    })}
                </View>
                <View style={styles.textContainer}>
                    <Text>{this.props.page.text}</Text>
                </View>
                {!this.state.open &&
                    <LinearGradient
                        start={[0.5, 1]}
                        end={[0.5, 0]}
                        colors={['white', 'transparent']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 150,
                        }}
                    />
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flexDirection: "column",
        borderRadius: 10,
        flex: 1,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        padding: 10,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15,
        overflow: 'hidden'
    },
    topDataContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    topData: {
        flexGrow: 0,
        fontWeight: 'bold',
        textAlign: 'right',
        marginLeft: 10
    },
    images: {
        flexDirection: 'row'
    },
    image: {
        width: 20,
        height: 20
    },
    textContainer: {
        marginTop: 10
    },
    text: {

    }
});
