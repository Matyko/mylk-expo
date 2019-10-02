import * as SecureStore from "expo-secure-store";
import {AsyncStorage} from "react-native";
import STORAGE_CONSTS from "./storageConsts";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import mLogger from "./mLogger";

export async function getItem(type) {
    return await AsyncStorage.getItem(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`)
}

export async function setItem(type, data) {
    if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
        try {
            const sync = JSON.parse(await getItem(STORAGE_CONSTS.SYNC) || false);
            if (sync) {
                const reference = firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);
                data.forEach(d => {
                    reference.doc(d._id).set(d, {merge: true})
                });
                mLogger(`Synced ${type} data to firebase`)
            }
        } catch {
            mLogger(`Could not sync ${type} data to firebase`)
        }
    }
    return await AsyncStorage.setItem(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`, JSON.stringify(data))
}

export async function deleteListItem(type, data, toDelete) {
    if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
        const reference = firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);
        data.forEach(d => {
            reference.doc(d._id).delete()
        })
    }
    return await AsyncStorage.setItem(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`, JSON.stringify(data.filter(d => d !== toDelete)))
}

export async function secureGetItem(type) {
    return await SecureStore.getItemAsync(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`)
}

export async function secureSetItem(type, data) {
    return await SecureStore.setItemAsync(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`, JSON.stringify(data))
}

export async function secureDeleteItem(type) {
    return await SecureStore.deleteItemAsync(`${type}.${firebase.auth().currentUser.uid ||
    await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID)}`)
}

export async function removeSynced() {
    // TODO MAYBE FIRBASE FUNCTIONS?
}

export async function syncOld() {
    const toSync = [STORAGE_CONSTS.PAGES, STORAGE_CONSTS.TASKS];
    toSync.forEach(async s => {
        const data = JSON.parse(await AsyncStorage.getItem(s) || []);
        await setItem(s, data)
    })
}

export async function find() {
}

