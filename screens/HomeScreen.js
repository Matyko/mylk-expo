import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Animated
} from 'react-native';
import Colors from "../constants/Colors";
import HomeScreenPill from "../components/HomeScreenPill";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';
import {Task} from "../models/Task";
import {Page} from "../models/Page";
import {getAllStatic} from "../models/BaseModel";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            pages: [],
            animVal: new Animated.Value(0)
        };
        this.props.navigation.addListener('willFocus', () => {
            this.getData();
        });
        // this.initSync();
    }

    async initSync() {
        const toSync = await Storage.getItem(STORAGE_CONSTS.SYNC)
        if (toSync) {
            await Storage.setUpSynced();
            await Storage.syncAll();
        }
    }

    getData() {
        const data = [
            {type: STORAGE_CONSTS.PAGES, classType: Page, stateName: 'tasks'},
            {type: STORAGE_CONSTS.TASKS, classType: Task, stateName: 'pages'}
        ];

        data.forEach(async ({type, classType, stateName}) => {
            try {
                let array = await getAllStatic(type, classType);
                const today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                array = array.filter(element => {
                    const eDate = new Date(+element.timeStamp);
                    eDate.setHours(0);
                    eDate.setMinutes(0);
                    return !element.checked && today.getTime() === eDate.getTime()
                });
                this.setState({...this.state, ...{[stateName]: array}})
            } catch {
                Alert.alert(`Could not load your ${type.toLowerCase()}`);
            }
        })

    }

    componentWillMount() {
        this.getData();
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
