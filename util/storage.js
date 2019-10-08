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
        try {
            return JSON.parse(await AsyncStorage.getItem(`${type}.${id}`))
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

async function getId() {
   // return firebase.auth().currentUser.uid ||
   return await SecureStore.getItemAsync(STORAGE_CONSTS.USER_ID);
}

export async function setItem(type, data) {
    // if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
    //     try {
    //         const sync = await getItem(STORAGE_CONSTS.SYNC) || false;
    //         if (sync) {
    //             const reference = firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);
    //             data.forEach(d => {
    //                 reference.doc(d._id).set(d, {merge: true})
    //             });
    //             mLogger(`Synced ${type} data to firebase`)
    //         }
    //     } catch {
    //         mLogger(`Could not sync ${type} data to firebase`)
    //     }
    // }
    const id = await getId();
    if (id) {
        return await AsyncStorage.setItem(`${type}.${id}`, JSON.stringify(data))
    }
}

export async function deleteListItem(type, data, toDelete) {
    // if (type === STORAGE_CONSTS.TASKS || type === STORAGE_CONSTS.PAGES) {
    //     try {
    //         const reference = firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);
    //         reference.doc(toDelete._id).delete()
    //     } catch (e) {
    //         mLogger('Could not connect to firebase')
    //     }
    // }
    const id = await getId();
    if (id) {

        const filtered = data.filter(d => d._id !== toDelete._id);

        return await AsyncStorage.setItem(`${type}.${id}`, JSON.stringify(filtered))
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

export async function syncAll() {
    const toSync = [STORAGE_CONSTS.PAGES, STORAGE_CONSTS.TASKS];
    for (const type of toSync) {
        const data = await AsyncStorage.getItem(type) || [];
        await setItem(type, data)
    }
    await getSynced();
}

export async function setUpSynced() {
    const toSync = [STORAGE_CONSTS.PAGES, STORAGE_CONSTS.TASKS];
    for (const type of toSync) {
        try {
            // const ref = await firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type);

            // TODO
            // ref.on("child_changed", async snapshot => {
            //     const changed = snapshot.val();
            //     const existing = await getItem(type) || [];
            //     existing.map(e => {
            //         if (e._id === changed._id) {
            //             return changed;
            //         } else {
            //             return e
            //         }
            //     });
            //     await setItem(type, existing)
            // });
            //
            // ref.on("child_added", async snapshot => {
            //     const newChild = snapshot.val();
            //     const existing = await getItem(type) || [];
            //     existing.push(newChild);
            //     await setItem(type, existing)
            // });
            //
            // ref.on("child_removed", async snapshot => {
            //     const removed = snapshot.val();
            //     const existing = await getItem(type) || [];
            //     const newArr = existing.filter(e => e._id !== removed._id);
            //     await setItem(type, newArr);
            // })
        } catch (e) {
            mLogger('Could not connect to firebase')
        }
    }
}

export async function getSynced() {
    // const toSync = [STORAGE_CONSTS.PAGES, STORAGE_CONSTS.TASKS];
    // try {
    //     for (const type of toSync) {
    //         const querySnapshot = await firebase.firestore().collection('userData').doc(firebase.auth().currentUser.uid).collection(type).get();
    //         const existing = await getItem(type) || [];
    //         const existingIds = existing.map(e => e._id);
    //         querySnapshot.forEach(doc => {
    //             const index = existingIds.indexOf(doc.id);
    //             const data = doc.data();
    //             if (index !== -1) {
    //                 existing[index] = {...existing[index], ...data}
    //             } else {
    //                 existing.push(data)
    //             }
    //         });
    //         await setItem(type, existing)
    //     }
    // } catch (e) {
    //     mLogger('Could not connect to firebase')
    // }
}

export async function find() {
}
