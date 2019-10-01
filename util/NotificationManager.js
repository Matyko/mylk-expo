import React from "react";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

export default class NotificationManager extends React.Component {

    sendNotificationImmediately = async ({title, body}) => {
        const hasPermissions = await this.askPermissions();
        if (hasPermissions) {
            return await Notifications.presentLocalNotificationAsync({
                title,
                body
            });
        } else {
            return Promise.reject('permission missing');
        }
    };

    scheduleNotification = async ({title, body, time, repeat = undefined}) => {
        const hasPermissions = await this.askPermissions();
        if (hasPermissions) {
            return Notifications.scheduleLocalNotificationAsync(
                {
                    title,
                    body
                },
                {
                    repeat,
                    time
                }
            )
        } else {
            return Promise.reject('permission missing');
        }
    };


    async createNotification({title, body, time}) {
        if (time) {
            return await this.scheduleNotification({title, body, time})
        } else {
            return await this.sendNotificationImmediately({title, body})
        }
    }

    async cancelNotification(notificationId) {
        return await Notifications.cancelScheduledNotificationAsync(notificationId)
    }

    askPermissions = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        return finalStatus === "granted";
    };

    render() {
        return null;
    }
}
