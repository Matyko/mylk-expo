import { BaseModel } from './BaseModel';
import STORAGE_CONSTS from '../util/storageConsts';

export class Page extends BaseModel {
  constructor({
    title,
    text,
    date,
    created_at,
    id,
    _id,
    images,
    _tasks,
    finishedDay,
    humanizedDate,
    _emojis,
    emojis,
  } = {}) {
    super({
      finishedDay,
      humanizedDate,
      title,
      text,
      date,
      created_at,
      id,
      _id,
      _emojis,
      emojis,
      type: STORAGE_CONSTS.PAGES,
      classType: Page,
    });
    this.images = images || [];
    this._tasks = _tasks || undefined;
  }
}
