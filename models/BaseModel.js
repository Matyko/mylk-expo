import formatDate from "../util/formatDate";
import * as Storage from '../util/storage';

export class BaseModel {
    constructor({title, date, created_at, id, type, classType}) {
        this._id = id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.title = title || '';
        this.date = date || formatDate(new Date());
        this.created_at = created_at || new Date();
        this._type = type;
        this.classType = null
    }

    async getAll() {
        return await JSON.parse(await Storage.getItem(this._type) || '[]');
    }

    async save() {
        const all = await this.getAll();
        let newAll;
        if (all.find(e => e._id === this._id)) {
            newAll = all.map(e => {
                if (e._id === this._id) {
                    return this;
                } else {
                    return e;
                }
            })
        } else {
            newAll = all.slice();
            newAll.push(this)
        }
        await Storage.setItem(this._type, newAll);
        return newAll.map(e => {
            return new this.classType(e);
        })
    }

    async delete() {
        const all = await this.getAll();
        await Storage.deleteListItem(this._type, all, this);
        return all.filter(e => e._id !== this._id).map(e => {
            console.log(e);
            return new this.classType(e);
        })
    }
}
