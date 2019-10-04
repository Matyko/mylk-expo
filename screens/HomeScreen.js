import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Animated
} from 'react-native';
import Colors from "../constants/Colors";
import HomeScreenPill from "../components/HomeScreenPill";
import formatDate from "../util/formatDate";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import {Task} from "../models/Task";
import {Page} from "../models/Page";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            pages: [],
            animVal: new Animated.Value(0)
        };
        this.props.navigation.addListener('willFocus', () => {
            this.getTasks();
            this.getPages();
        });
        this.initSync();
    }

    async initSync() {
        const toSync = await Storage.getItem(STORAGE_CONSTS.SYNC)
        if (toSync) {
            await Storage.setUpSynced();
            await Storage.syncAll();
        }
    }

    getTasks() {
        try {
            Storage.getItem(STORAGE_CONSTS.TASKS).then(async result => {
                let tasks = result || [];
                tasks.map(t => {
                   return new Task(t);
                });
                await Storage.setItem(STORAGE_CONSTS.TASKS, tasks);
                const today = formatDate(new Date());
                tasks = tasks.filter(t => {
                    return !t.checked && today === t.date.split(' ')[0]
                });
                this.setState({...this.state, ...{tasks}})
            })
        } catch {
            Alert.alert('Could not load your tasks');
        }
    }

    getPages() {
        try {
            Storage.getItem(STORAGE_CONSTS.PAGES).then(async result => {
                let pages = result || [];
                const today = formatDate(new Date());
                pages = pages.filter(p => {
                    return today === p.date
                }).map(p => {
                    return new Page(p)
                });
                this.setState({...this.state, ...{pages}})
            })
        } catch {
            Alert.alert('Could not load your pages');
        }
    }

    componentWillMount() {
        this.getTasks();
        this.getPages();
    }

    componentDidMount() {
        Animated.spring(this.state.animVal, {
            toValue: 1
        }).start()
    }

    render() {
        const {navigate} = this.props.navigation;
        const style = [
            {transform: [{scale:
                        this.state.animVal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.85, 1],
                        })
                }]
            }];
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill text={`Today is: ${new Date().toDateString()}`}/>
                    </Animated.View>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill
                            handlePress={() => navigate("Tasks")}
                            text={`You have ${this.state.tasks.length ? this.state.tasks.length :
                                'no'} task${this.state.tasks.length !== 1 ? 's' :
                                ''} for today.`}/>
                    </Animated.View>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill
                            handlePress={() => navigate("Journal")}
                            text={`You have added ${this.state.pages.length ? this.state.pages.length :
                                'no'} page${this.state.pages.length !== 1 ? 's' :
                                ''} for today to your Journal.`}/>
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }
}

HomeScreen.navigationOptions = {
    header: null,
    headerStyle: {
        backgroundColor: '#f4511e',
        height: 79,
    },
    headerTitleStyle: {
        color: Colors.primaryText,
        lineHeight: 79,
        fontWeight: 'bold',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    contentContainer: {
        paddingTop: 50,
        paddingHorizontal: 20
    },
    canvas: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    }
});
