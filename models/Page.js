
import {BaseModel} from "./BaseModel";
import STORAGE_CONSTS from "../util/storageConsts";

export class Page extends BaseModel {
    constructor({title, date, created_at, id, images}) {
        super({title, date, created_at, id, type: STORAGE_CONSTS.PAGES});
        this.images = images
    }
}
