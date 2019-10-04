import formatDate from "../util/formatDate";
import * as Storage from '../util/storage';
import Emoji from 'node-emoji';

export class BaseModel {
    constructor({title, text, date, created_at, _id, id, type, classType}) {
        this._id = _id || id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.title = title || '';
        this.text = text || '';
        this.date = date || formatDate(new Date());
        this.created_at = created_at || new Date();
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
        console.log(this._emojis);
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
        const stringArray = this.title.toLowerCase().split(' ').concat(this.text.toLowerCase.split(' '));
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
