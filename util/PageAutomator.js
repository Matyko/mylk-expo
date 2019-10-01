import React from "react";
import {AsyncStorage} from "react-native";
import formatDate from "./formatDate";

export default class PageAutomator extends React.Component {

    async taskChecked({_id, title, finishedDay}) {
        const result = await AsyncStorage.getItem('pages');
        const pages = result ? JSON.parse(result) : [];
        const page = pages.find(e => e.finishedDay === finishedDay);
        if (page) {
            page._tasks.push({_id, title})
        } else {
            const newPage = {
                text: 'What I accomplished today:',
                date: formatDate(new Date(finishedDay)),
                finishedDay: finishedDay,
                created_at: new Date(),
                _id: new Date().getTime().toString() + pages.length,
                _tasks: [{_id, title}]
            };
            pages.push(newPage);
        }
        await AsyncStorage.setItem('pages', JSON.stringify(pages));
    }

    async taskUnChecked({_id, finishedDay}) {
        const result = await AsyncStorage.getItem('pages');
        let pages = result ? JSON.parse(result) : [];
        const page = pages.find(e => e.finishedDay === finishedDay);
        if (page) {
            page._tasks = page._tasks.filter(e => e._id !== _id);
            if (!page._tasks.length) {
                pages = pages.filter(e => e !== page);
            }
        }
        await AsyncStorage.setItem('pages', JSON.stringify(pages));
    }

    render() {
        return null;
    }
}
