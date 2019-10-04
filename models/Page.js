
import {BaseModel} from "./BaseModel";
import STORAGE_CONSTS from "../util/storageConsts";

export class Page extends BaseModel {
    constructor({title, date, created_at, id, _id, images}) {
        super({title, date, created_at, id, _id, type: STORAGE_CONSTS.PAGES, classType: Page});
        this.images = images
    }
}
