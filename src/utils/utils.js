import axios from 'axios'
import './axios'
import router from '../router'

/**
 * 网络请求类
 */
export class Net {
    /**
     * get请求，不带token
     */
    static get(url, param, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: url,
                params: param,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    /**
     * post请求，不带token
     */
    static post(url, param, data,header={   'Content-Type': 'multipart/form-data' },) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: url,
                params: param,
                data: data,
                headers: header
            })
                .then(res => {
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    /**
     * patch请求
     */
    static patch(url, param, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'PATCH',
                url: url,
                params: param,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
    /**
     * put请求
     */
    static put(url, param, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'PUT',
                url: url,
                params: param,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    /**
     * delete请求
     */
    static delete(url, param, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'DELETE',
                url: url,
                params: param,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    resolve(res)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
}

/**
 * 公共方法类
 */
export class Common {
    /**
     * 格式化时间戳
     * @param data
     * @param format
     * @returns {*}
     */
    static formatTime(data, format) {
        function formatNumber(n, bool) {
            n = n.toString()
            if (bool) {
                return n
            } else {
                return n.length - 1 ? n : '0' + n
            }
        }

        let formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
        let returnArr = []
        let date = new Date(data * 1000)
        returnArr.push(date.getFullYear())
        returnArr.push(formatNumber(date.getMonth() + 1, true))
        returnArr.push(formatNumber(date.getDate(), true))

        returnArr.push(formatNumber(date.getHours(), false))
        returnArr.push(formatNumber(date.getMinutes(), false))
        returnArr.push(formatNumber(date.getSeconds(), false))

        for (let i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i])
        }
        return format
    }

    /**
     * 获取时间戳
     * @returns {number}
     */
    static currentTime() {
        return new Date().getTime()
    }

    /**
     * 生成随机命名
     * @returns {number}
     */
    static random_string(len) {
        len = len || 32
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = chars.length
        var pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    }

    /**
     * 是否json字符串
     * @param str
     * @returns {boolean}
     */
    static isJson(str) {
        if (typeof str === 'string') {
            try {
                let obj = JSON.parse(str)
                if (typeof obj === 'object' && obj) {
                    return true
                } else {
                    return false
                }
            } catch (e) {
                console.log('error：' + str + '!!!' + e)
                return false
            }
        }
        // console.log("It is not a string!");
    }
}

/**
 * 数据存储类
 */
export class DataStore {
    /**
     * 设置本地缓存
     * @param key
     * @param data
     */
    static localSet(key, data) {
        if (typeof data === 'object') data = JSON.stringify(data)
        // console.log(data)
        return localStorage.setItem(key, data)
    }

    /**
     * 获取本地缓存
     * @param key
     * @returns {*}
     */
    static localGet(key) {
        let data = localStorage.getItem(key)
        if (Common.isJson(data)) data = JSON.parse(data)
        return data
    }

    /**
     * 删除本地缓存
     * @param key
     */
    static localDel(key) {
        return localStorage.removeItem(key)
    }

    /**
     * 清楚所有本地缓存
     * @constructor
     */
    static ClearLocal() {
        return localStorage.clear()
    }

    /**
     * 设置sessionStorage
     * @param key
     * @param data
     */
    static SessionSet(key, data) {
        if (Common.isJson(data)) data = JSON.parse(data)
        return sessionStorage.setItem(key, data)
    }

    /**
     * 获取sessionStorage
     * @param key
     * @constructor
     */
    static SessionGet(key) {
        let data = sessionStorage.getItem(key)
        if (Common.isJson(data)) data = JSON.parse(data)
        return data
    }

    /**
     * 删除sessionStorage
     * @param key
     */
    static SessionDel(key) {
        return sessionStorage.removeItem(key)
    }

    /**
     * 清楚所有sessionStorage
     * @constructor
     */
    static SessionClear() {
        return sessionStorage.clear()
    }
}

/**
 * 路由工具类
 */
export class Jump {
    /**
     * 路由重定向，即关闭所有页面
     * @param url
     */
    static Redirect(url) {
        router.replace({
            path: url,
        })
    }

    /**
     * 直接跳转。保留当前页面，query传参
     * @param url
     * @param query
     */
    static Open(url, query) {
        router.push({
            path: url,
            query: query,
        })
    }

    /**
     * 直接跳转。保留当前页面，params传参
     * @param url
     * @param params
     */
    static OpenP(name, params) {
        router.push({
            name: name,
            params: params,
        })
    }

    /**
     * 返回上一页
     * @param name app 中跳转时传的页面name 如果不存在name就返回上一页 存在就返回指定页面
     */
    static Back(name = '') {
        router.go(-1)
    }

    /**
     * 关闭到首页
     */
    static closeAll() {
        let len = history.length
        history.go(-(len - 1))
    }
}
