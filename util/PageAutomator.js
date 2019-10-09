import React from 'react';
import STORAGE_CONSTS from '../util/storageConsts';
import { Page } from '../models/Page';
import { getAllStatic } from '../models/BaseModel';

export default class PageAutomator {
  async taskChecked({ _id, title, _emojis, finishedDay }) {
    const pages = await getAllStatic(STORAGE_CONSTS.PAGES, Page);
    const page = pages.find(e => e.finishedDay === finishedDay);
    if (page) {
      if (!Array.isArray(page._tasks)) {
        page._tasks = [];
      }
      page._tasks.push({ _id, title });
      page._emojis.concat(_emojis);
      page.save();
    } else {
      const newPage = new Page({
        text: 'What I accomplished today:',
        date: finishedDay,
        finishedDay,
        created_at: new Date().getTime(),
        _emojis: _emojis || [],
        _tasks: [{ _id, title }],
      });
      console.log(newPage);
      await newPage.save();
    }
  }

  async taskUnChecked({ _id, finishedDay }) {
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
