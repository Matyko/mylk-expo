import formatDate from "../util/formatDate";
import * as Storage from '../util/storage';

export class BaseModel {
    constructor({title, date, created_at, id, type}) {
        this._id = id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.title = title || '';
        this.date = date || formatDate(new Date());
        this.created_at = created_at || new Date();
        this._type = type;
    }

    async getAll() {
        return await JSON.parse(await Storage.getItem(this._type) || '[]');
    }

    async save() {
        const all = this.getAll();
        let old = all.find(e => e._id);
        if (old) {
            old = this
        } else {
            all.push(this)
        }
        await Storage.setItem(this._type, all);
        return all
    }

    async delete() {
        const all = this.getAll();
        const newAll = all.filter(e => e._id !== this._id);
        await Storage.setItem(this._type, newAll);
        return all
    }
}
