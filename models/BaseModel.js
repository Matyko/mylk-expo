import Emoji from 'node-emoji';
import * as Storage from '../util/storage';

export class BaseModel {
  constructor({
    title,
    text,
    timeStamp,
    created_at,
    modified_at,
    _id,
    id,
    type,
    classType,
    finishedDay,
    humanizedDate,
    _emojis,
    emojis,
  }) {
    this._id =
      _id ||
      id ||
      Math.random()
        .toString(36)
        .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
    this.title = title || '';
    this.text = text || '';
    this.timeStamp = timeStamp || new Date().getTime();
    this.created_at = created_at || new Date().getTime();
    this.finishedDay = finishedDay || null;
    this.humanizedDate = humanizedDate || '';
    this.modified_at = modified_at ? new Date(+modified_at) : this.created_at;
    this._type = type;
    this._classType = classType;
    this._emojis = _emojis || emojis || [];
  }

  async getAll() {
    const all = (await Storage.getItem(this._type)) || [];
    return all.map(e => new this._classType(e));
  }

  async save() {
    this._emojis = this._searchTextForEmojis();
    if (this._classType === 'pages') {
      console.log(this)
    }
    const all = await this.getAll();
    let newAll;
    const found = all.find(e => e._id === this._id);
    if (found) {
      newAll = all.map(e => {
        e.modified_at = new Date().getTime();
        if (e._id === this._id) {
          return this;
        } else {
          return e;
        }
      });
    } else {
      newAll = all.slice();
      newAll.push(this);
    }
    await Storage.setItem(this._type, newAll);

    return newAll.map(e => {
      return new this._classType(e);
    });
  }

  async delete() {
    const all = await this.getAll();
    await Storage.deleteListItem(this._type, all, this);
    return all
      .filter(e => e._id !== this._id)
      .map(e => {
        return new this._classType(e);
      });
  }

  _searchTextForEmojis() {
    const result = [];
    const maxEmojis = 3;
    let stringArray = [];
    stringArray = [...stringArray, ...(this.title ? this.title.toLowerCase().split(' ') : [])];
    stringArray = [...stringArray, ...(this.text ? this.text.toLowerCase().split(' ') : [])];
    if (this._tasks) {
      this._tasks.forEach(t => {
        stringArray = [...stringArray, ...(t.title ? t.title.toLowerCase().split(' ') : [])];
      });
    }
    for (const string of stringArray) {
      const found = Emoji.findByName(string);
      if (found) {
        result.push(found.key);
      } else if (string.charAt(string.length - 1) === 's') {
        const secondTry = Emoji.findByName(string.substring(0, string.length - 1));
        if (secondTry) {
          result.push(secondTry.key);
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
  const all = (await Storage.getItem(type)) || [];
  return all.map(e => {
    return new classType(e);
  });
}
