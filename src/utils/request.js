import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 創建axios實例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 50000 // 請求超時時間
})

// request攔截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 讓每個請求攜帶自定義token 請根據實際情況自行修改
  }

  if (store.getters.isIdentityAuth) {
    config.headers['Authorization'] = 'Bearer ' + store.getters.oidcAccessToken
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone攔截器
service.interceptors.response.use(
  response => {
    /**
    * code為非200是拋錯 可結合自己業務進行修改
    */
    const res = response.data
    if (res.code !== 200) {
      // 50008:非法的token; 50012:其他客戶端登錄了;  50014:Token 過期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code == 401) {
        MessageBox.confirm('登錄已超時，可以【取消】繼續留在該頁面，或者【重新登錄】', '超時提醒', {
          confirmButtonText: '重新登錄',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 為了重新實例化vue-router對象 避免bug
          })
        })
      } else {
        Message({
          message: res.message || res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: '登入逾時，請重新登入',
      type: 'error',
      duration: 10 * 1000
    })
    window.location.reload();
    return Promise.reject(error)
  }
)

export default service
