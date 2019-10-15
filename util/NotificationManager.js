/* eslint-disable no-return-await */
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import * as Storage from './storage';
import STORAGE_CONSTS from './storageConsts';

export default class NotificationManager {
  static async sendNotificationImmediately({ title, body }) {
    const hasPermissions = await this.askPermissions();
    if (hasPermissions) {
      return await Notifications.presentLocalNotificationAsync({
        title,
        body,
      });
    }
    return Promise.reject(new Error('permission missing'));
  }

  static async scheduleNotification({ title, body, time, repeat = undefined }) {
    const hasPermissions = await this.askPermissions();
    if (hasPermissions) {
      return await Notifications.scheduleLocalNotificationAsync(
        {
          title,
          body,
        },
        {
          repeat,
          time,
        }
      );
    }
    return Promise.reject(new Error('permission missing'));
  }

  static async createNotification({ title, body, time }) {
    const enabled = (await Storage.getItem(STORAGE_CONSTS.NOTIFICATIONS)) || false;
    if (enabled) {
      if (time) {
        return await this.scheduleNotification({ title, body, time });
      }
      return await this.sendNotificationImmediately({ title, body });
    } else {
      return null;
    }
  }

  static async cancelNotification(notificationId) {
    return await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  static async askPermissions() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
}
