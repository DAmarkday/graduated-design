import axios from 'axios'
import router from '../router'

// 传参拦截器
axios.interceptors.request.use(
    function(config) {
        config.params &&
            Object.keys(config.params).forEach(k => {
                config.params[k].trim &&
                    (config.params[k] = config.params[k].trim())
            })
        if (process.env.NODE_ENV !== 'development') {
            //非开发环境
            config.params = { ...config.params, t: Date.now() }
        }
        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    function({ data }) {
        if (data.code === 401) {
            router.push({ path: '/login' })
        }
        // if (data.code !== 200) {
        // 	return Promise.reject(data);
        // }
        return Promise.resolve(data)
    },
    function(error) {
        if (error.response) {
            if (error.response.status === 401) router.push({ path: '/' })
            if (error.response.status !== 404) console.log(error)
        }
        if (error.response.status !== 200) console.log(error)
        return Promise.reject(error)
    }
)

axios.defaults.baseURL = '/' // 本地测试
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-type': 'application/json;charset=UTF-8',
}
axios.defaults.timeout = 200000
axios.defaults.withCredentials = true
