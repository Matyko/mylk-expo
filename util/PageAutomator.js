import React from "react";
import formatDate from "./formatDate";
import * as Storage from '../util/storage';
import STORAGE_CONSTS from '../util/storageConsts';

export default class PageAutomator extends React.Component {

    async taskChecked({_id, title, finishedDay}) {
        const result = await Storage.getItem(STORAGE_CONSTS.PAGES);
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
        await Storage.setItem(STORAGE_CONSTS.PAGES, pages);
    }

    async taskUnChecked({_id, finishedDay}) {
        const result = await Storage.getItem(STORAGE_CONSTS.PAGES);
        let pages = result ? JSON.parse(result) : [];
        const page = pages.find(e => e.finishedDay === finishedDay);
        if (page) {
            page._tasks = page._tasks.filter(e => e._id !== _id);
            if (!page._tasks.length) {
                pages = pages.filter(e => e !== page);
            }
        }
        await Storage.setItem(STORAGE_CONSTS.PAGES, pages);
    }

    render() {
        return null;
    }
}
