import formatDate from "../util/formatDate";
import * as Storage from '../util/storage';
import Emoji from 'node-emoji';

export class BaseModel {
    constructor({title, text, date, created_at, modified_at,  _id, id, type, classType, finishedDay}) {
        this._id = _id || id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.title = title || '';
        this.text = text || '';
        this.date = date ? new Date(+date) : new Date().getTime();
        this.created_at = created_at ? new Date(+created_at) : new Date().getTime();
        this.finishedDay = finishedDay || null;
        this.modified_at = modified_at ? new Date(+modified_at) : this.created_at;
        this._type = type;
        this._classType = classType;
        this._emojis = []
    }

    async getAll() {
        const all = await Storage.getItem(this._type) || [];
        return all.map(e => new this._classType(e))
    }

    async save() {
        this._emojis = this._searchTextForEmojis();
        const all = await this.getAll();
        let newAll;
        if (all.find(e => e._id === this._id)) {
            newAll = all.map(e => {
                e.date = e.date.getTime();
                e.created_at = e.created_at.getTime();
                e.modified_at = new Date().getTime();
                if (e._id === this._id) {
                    return this;
                } else {
                    return e;
                }
            })
        } else {
            newAll = all.slice();
            newAll.push(this);
        }
        await Storage.setItem(this._type, newAll);

        return newAll.map(e => {
            return new this._classType(e);
        })
    }

    async delete() {
        const all = await this.getAll();
        await Storage.deleteListItem(this._type, all, this);
        return all.filter(e => e._id !== this._id).map(e => {
            return new this._classType(e);
        })
    }

    _searchTextForEmojis() {
        const result = [];
        const maxEmojis = 3;
        let stringArray = [];
        Array.prototype.push.apply(stringArray, this.title ? this.title.toLowerCase().split(' ') : []);
        Array.prototype.push.apply(stringArray, this.text ? this.text.toLowerCase().split(' ') : []);
        for (const string of stringArray) {
            const found = Emoji.findByName(string);
            if (found) {
                result.push(found);
            } else if (string.charAt(string.length - 1) === 's') {
                const secondTry = Emoji.findByName(string.substring(0, string.length - 1));
                if (secondTry) {
                    result.push(secondTry)
                }
            }
            if (result.length === maxEmojis) {
                break;
            }
        }
        return result;
    }
}

export async function getAllStatic(type, classType) {
    const all = await Storage.getItem(type) || [];
    return all.map(e => {
        return new classType(e)
    })
}
