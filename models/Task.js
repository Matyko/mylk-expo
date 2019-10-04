import formatDate from "../util/formatDate";
import NotificationManager from "../util/NotificationManager"
import parseDate from "../util/parseDate";
import {BaseModel} from "./BaseModel";
import STORAGE_CONSTS from "../util/storageConsts";

export class Task extends BaseModel {
    constructor({title, text, date, created_at, isFullDay, repeats, id, _id, notificationId, checked}) {
        super({title, text, date, created_at, id, _id, type: STORAGE_CONSTS.TASKS, classType: Task});
        this._notificationId = notificationId || null;
        this.isFullDay = isFullDay;
        this.text = text;
        this.repeats = repeats;
        this.checked = checked || false;
        this._notificationManager = new NotificationManager();
        if (this.repeats) {
            this._handleRepeat()
        }
    }

    async createNotification() {
        if (new Date().getTime() < parseDate(this.date)) {
            this._notificationId = await this._notificationManager.createNotification({
                title: 'Mylk task reminder',
                body: this.title,
                time: parseDate(this.date) + (this.isFullDay ? 25200000 : 0),
                repeat: this.repeats
            });
            return this._notificationId;
        }
    }

    async cancelNotification() {
        if (this._notificationId) {
            await this._notificationManager.cancelNotification(this._notificationId);
        }
        this._notificationId = null;
    }

    _handleRepeat() {
        const dates = this.date.split(' ');
        const date = new Date(dates[0]);
        const today = new Date(new Date().toDateString());
        if (date.getTime() < today.getTime()) {
            switch(this.repeats) {
                case "day":
                    date.setDate(today.getDate());
                    break;
                case "week":
                    date.setDate(date.getDate() + 7);
                    break;
                case "month":
                    date.setMonth(date.getMonth() + 1);
                    break;
                case "year":
                    date.setFullYear(date.getFullYear() + 1);
            }
            const newDate = formatDate(date);
            this.date = newDate + (dates[1] ? ' ' + dates[1] : '');
            this.checked = false;
        }
    }

    async remove() {
        this.cancelNotification();
        return await this.delete()
    }

}
