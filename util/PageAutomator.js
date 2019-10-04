import React from "react";
import formatDate from "./formatDate";
import STORAGE_CONSTS from '../util/storageConsts';
import {Page} from "../models/Page";
import {getAllStatic} from "../models/BaseModel";

export default class PageAutomator {

    async taskChecked({_id, title, finishedDay}) {
        const pages = await getAllStatic(STORAGE_CONSTS.PAGES, Page);
        const page = pages.find(e => e.finishedDay === finishedDay);
        if (page) {
            page._tasks.push({_id, title});
            page.save();
        } else {
            const newPage = new Page({
                text: 'What I accomplished today:',
                date: formatDate(new Date(finishedDay)),
                finishedDay: finishedDay,
                created_at: new Date(),
                _tasks: [{_id, title}]
            });
            await newPage.save()
        }
    }

    async taskUnChecked({_id, finishedDay}) {
        const pages = await getAllStatic(STORAGE_CONSTS.PAGES, Page);
        const page = pages.find(e => e.finishedDay === finishedDay);
        if (page && page._tasks) {
            page._tasks = page._tasks.filter(e => e._id !== _id);
            if (!page._tasks.length) {
                page.delete();
            } else {
                page.save();
            }
        }
    }
}
