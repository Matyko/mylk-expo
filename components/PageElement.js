import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Platform} from "react-native";
import Colors from "../constants/Colors";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";

export default class PageElement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open: !!this.props.fullPage,
            editable: false
        };
        this.config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 30
        };
        this.DIRECTIONS = {
            RIGHT: 'RIGHT',
            LEFT: 'LEFT'
        };
    }

    onSwipe = (gestureName) => {
        switch (gestureName) {
            case this.DIRECTIONS.LEFT:
                this.setState({...this.state, ...{open: false, editable: false}});
                break;
            case this.DIRECTIONS.RIGHT:
                this.setState({...this.state, ...{open: true, editable: true}});
                break;
        }
    };

    render() {
        return (
            <GestureRecognizer
            onSwipeLeft={() => this.onSwipe(this.DIRECTIONS.RIGHT)}
            onSwipeRight={() => this.onSwipe(this.DIRECTIONS.LEFT)}
            style={this.props.fullPage ? {height: '100%'} : {}}
            config={this.config}>
                <TouchableOpacity
                    onPress={() => this.setState({...this.state, ...{open: !this.state.open}})}
                    onLongPress={() => this.setState({...this.state, ...{open: true, editable: !this.state.editable}})}
                    style={[styles.container, {maxHeight: this.props.fullPage ? 10000 : this.state.open ? 10000 : 150}]}>
                    <View style={styles.topDataContainer}>
                        {this.props.page.mood && <Text style={styles.topData}>Mood</Text>}
                        <Text style={styles.topData}>{this.props.page.date}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.images}
                        onPress={() => this.props.openImages()}>
                        {this.props.page.images && this.props.page.images.map(path => {
                            return <Image key={path} source={{ uri: path }} style={styles.image} />
                        })}
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                        <Text>{this.props.page.text}</Text>
                        {this.props.page._tasks &&
                            this.props.page._tasks.map(t => {
                                return <Text key={t._id}>{t.title}</Text>
                            })
                        }
                    </View>
                    {this.state.editable &&
                    !this.props.page._tasks &&
                    <View style={styles.bottom}>
                        <Ionicons
                            name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
                            size={35}
                            color={Colors.primaryBackground}
                            style={styles.icon}
                            onPress={() => this.props.deletePage()}
                        />
                        <Ionicons
                            name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
                            size={35}
                            color={Colors.primaryBackground}
                            style={styles.icon}
                            onPress={() => this.props.toEdit()}
                        />
                    </View>
                    }
                    {!this.state.open &&
                        <LinearGradient
                            start={[0.5, 1]}
                            end={[0.5, 0]}
                            colors={[Colors.white, Colors.transparent]}
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
            </GestureRecognizer>
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
        width: 35,
        height: 35,
        marginLeft: 5
    },
    textContainer: {
        marginTop: 10
    },
    text: {

    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        margin: 5
    }
});
