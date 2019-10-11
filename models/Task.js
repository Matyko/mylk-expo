import NotificationManager from '../util/NotificationManager';
import { BaseModel } from './BaseModel';
import STORAGE_CONSTS from '../util/storageConsts';
import mLogger from '../util/mLogger';

export class Task extends BaseModel {
  constructor({
    title,
    text,
    timeStamp,
    created_at,
    repeats,
    id,
    _id,
    notificationId,
    _notificationId,
    checked,
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
      timeStamp,
      created_at,
      id,
      _id,
      _emojis,
      emojis,
      type: STORAGE_CONSTS.TASKS,
      classType: Task,
    });
    this._notificationId = notificationId || _notificationId || null;
    this.repeats = repeats || false;
    this.checked = checked || false;
    if (this.repeats) {
      this._handleRepeat();
    }
  }

  async createNotification() {
    if (new Date().getTime() < this.timeStamp) {
      this._notificationId = await NotificationManager.createNotification({
        title: 'Mylk task reminder',
        body: this.title,
        time: this.timeStamp,
        repeat: this.repeats,
      });
      mLogger(`notification created with id: ${this._notificationId}`);
      return this._notificationId;
    }
    return null;
  }

  async cancelNotification() {
    if (this._notificationId) {
      await NotificationManager.cancelNotification(this._notificationId);
    }
    this._notificationId = null;
  }

  _handleRepeat() {
    const oDate = new Date(this.timeStamp);
    const date = new Date(oDate.toDateString());
    const today = new Date(new Date().toDateString());
    if (date.getTime() < today.getTime()) {
      switch (this.repeats) {
        case 'day':
          date.setDate(today.getDate());
          break;
        case 'week':
          date.setDate(date.getDate() + 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() + 1);
      }
      date.setHours(oDate.getHours());
      date.setMinutes(oDate.getMinutes());
      this.timeStamp = date.getTime();
      this.checked = false;
    }
  }

  async remove() {
    this.cancelNotification();
    return await this.delete();
  }
}
