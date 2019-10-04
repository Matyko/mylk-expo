
import {BaseModel} from "./BaseModel";
import STORAGE_CONSTS from "../util/storageConsts";

export class Page extends BaseModel {
    constructor({title, text, date, created_at, id, _id, images, _tasks, finishedDay}) {
        super({title, text, date, created_at, id, _id, type: STORAGE_CONSTS.PAGES, classType: Page});
        this.images = images;
        this.tasks = _tasks;
        this.finishedDay = finishedDay
    }
}
