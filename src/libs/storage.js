import localforage from 'localforage'
localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: process.env.VUE_APP_NAME,
    storeName: 'default'
})
export default {
    install(Vue, options) {
        Vue.prototype.$storage = this
    },
    get(key) {
        return new Promise((resolve, reject) => {
            localforage.getItem(key, (err, value) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(value)
            })
        })
    },

    set(key, value) {
        return new Promise((resolve, reject) => {
            localforage.setItem(key, value, err => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    },

    remove(key) {
        return new Promise((resolve, reject) => {
            localforage.removeItem(key, err => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }
}

