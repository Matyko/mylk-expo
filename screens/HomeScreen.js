import React, {Component} from 'react';
import {
    AsyncStorage,
    ScrollView,
    StyleSheet,
    View,
    Animated
} from 'react-native';
import NotificationManager from "../util/NotificationManager";
import mLogger from "../util/mLogger";
import Colors from "../constants/Colors";
import HomeScreenPill from "../components/HomeScreenPill";
import formatDate from "../util/formatDate";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            animVal: new Animated.Value(0)
        };
        this.props.navigation.addListener('willFocus', () => this.getTasks());
    }

    getTasks() {
        try {
            mLogger('Loading tasks');
            AsyncStorage.getItem('tasks').then(async result => {
                let tasks = result ? JSON.parse(result) : [];
                tasks.map(t => {
                   if (t.repeats) {
                       t = this.handleRepeat(t)
                   }
                });
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
                const today = formatDate(new Date());
                tasks = tasks.filter(t => {
                    return !t.checked && today === t.date.split(' ')[0]
                });
                this.setState({...this.state, ...{tasks}})
            })
        } catch {
            Alert.alert('Could not load your tasks');
            mLogger('could not load tasks')
        }
    }

    handleRepeat(task) {
        const dates = task.date.split(' ');
        const date = new Date(dates[0]);
        const today = new Date(new Date().toDateString());
        if (date.getTime() < today.getTime()) {
            switch(task.repeats) {
                case "day":
                    date.setDate(today.getDate());
                    break;
                case "week":
                    date.setDate(date.getDate() + 7);
                    break;
                case "month":
                    date.setMonth(date.getMonth() + 1);
                    break;
                case "year":
                    date.setFullYear(date.getFullYear() + 1);
            }
            task.checked = false;
        }
        return task;
    }

    componentWillMount() {
        this.getTasks();
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
                    <NotificationManager/>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill text={`Today is: ${new Date().toDateString()}`}/>
                    </Animated.View>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill
                            handlePress={() => navigate("Tasks")}
                            text={`You have ${this.state.tasks.length ? this.state.tasks.length : 'no'} task${this.state.tasks.length !== 1 && 's'} for today.`}/>
                    </Animated.View>
                    <Animated.View
                        style={style}>
                        <HomeScreenPill
                            handlePress={() => navigate("Journal")}
                            text={`You did not add a new page for today to your Journal yet.`}/>
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
        backgroundColor: Colors.transparent,
    },
    contentContainer: {
        paddingTop: 50,
        paddingHorizontal: 20
    }
});
