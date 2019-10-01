import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";

let user_id = null;

export async function setUID(uid) {
    user_id = uid;
}

export async function getItem(type) {
    return await AsyncStorage.getItem(`${type}.${user_id}`)
}

export async function setItem(type, data) {
    return await AsyncStorage.setItem(`${type}.${user_id}`, data)
}

export async function secureGetItem(type) {
    return await SecureStore.getItemAsync(`${type}.${user_id}`)
}

export async function secureSetItem(type, data) {
    return await SecureStore.setItemAsync(`${type}.${user_id}`, data)
}

export async function secureDeleteItem(type) {
    return await SecureStore.deleteItemAsync(`${type}.${user_id}`)
}

export async function find() {}

