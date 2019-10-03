import * as SecureStore from "expo-secure-store";
import {AsyncStorage} from "react-native";
import STORAGE_CONSTS from "./storageConsts";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import mLogger from "./mLogger";

export async function getItem(type) {
    const id = await getId();
    if (id) {
        return await AsyncStorage.getItem(`${type}.${id}`)
    }
}

async function getId() {
   return firebase.auth().currentUser.uid || await AsyncStorage.getItem(STORAGE_CONSTS.USER_ID);
}

export async function setItem(type, data) {
    if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
        try {
            const sync = JSON.parse(await getItem(STORAGE_CONSTS.SYNC) || 'false');
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
    const id = await getId();
    if (id) {
        return await AsyncStorage.setItem(`${type}.${id}`, JSON.stringify(data))
    }
}

export async function deleteListItem(type, data, toDelete) {
    if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
        const reference = firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);
        reference.doc(toDelete._id).delete()
    }
    const id = await getId();
    if (id) {
        return await AsyncStorage.setItem(`${type}.${id}`, JSON.stringify(data.filter(d => d !== toDelete)))
    }
}

export async function secureGetItem(type) {
    const id = await getId();
    if (id) {
        return await SecureStore.getItemAsync(`${type}.${id}`)
    }
}

export async function secureSetItem(type, data) {
    const id = await getId();
    if (id) {
        return await SecureStore.setItemAsync(`${type}.${id}`, JSON.stringify(data))
    }
}

export async function secureDeleteItem(type) {
    const id = await getId();
    if (id) {
        return await SecureStore.deleteItemAsync(`${type}.${id}`)
    }
}

export async function removeSynced() {
    // TODO MAYBE FIREBASE FUNCTIONS?
}

export async function syncOld() {
    const toSync = [STORAGE_CONSTS.PAGES, STORAGE_CONSTS.TASKS];
    toSync.forEach(async s => {
        const data = JSON.parse(await AsyncStorage.getItem(s) || '[]');
        await setItem(s, data)
    })
}

export async function find() {
}

