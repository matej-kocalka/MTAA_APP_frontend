import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

/**
 * Schedules a daily notification at the specified time.
 * @param {Date} dateTime - JavaScript Date object representing the time of day for the reminder.
 */
export const scheduleReminder = async (dateTime) => {
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's time to workout!",
            body: "You have set a reminder, and here it is.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
        }
    });
    alert("Reminder set");
    const reminderInfo = {
        id: identifier,
        time: dateTime.toISOString(),
    };

    await AsyncStorage.setItem("dailyReminderInfo", JSON.stringify(reminderInfo));
};

/**
 * Cancels the currently stored daily reminder, if any.
 */
export const cancelReminder = async () => {
    const json = await AsyncStorage.getItem("dailyReminderInfo");
    if (json) {
        const { id } = JSON.parse(json);
        await Notifications.cancelScheduledNotificationAsync(id);
        await AsyncStorage.removeItem("dailyReminderInfo");
    }
    alert("Reminder canceled.")
};

/**
 * Loads the stored reminder time, if it exists.
 * @returns {Promise<string|null>} The ISO string of the reminder time or undefined.
 */
export const loadReminder = async () => {
    const json = await AsyncStorage.getItem("dailyReminderInfo");
    if (json) {
        const { time } = JSON.parse(json);
        return time;
    }
    return null;
};
