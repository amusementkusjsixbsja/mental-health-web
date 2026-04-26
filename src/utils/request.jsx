import axios from 'axios'
import { message } from 'antd'

//*创建请求实例
const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})
//* 请求拦截器
request.interceptors.request.use(
  (config) => {
    //* 检查是否有token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//* 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code == 200) {
      return data.data
    } else {
      return Promise.reject(new Error(data.message || data.msg || '请求失败'))
    }
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/Auth/login'
        return Promise.reject(error)
      }
      return Promise.reject(new Error(error.response.data?.message || error.response.data?.msg || '网络请求失败'))
    } else {
      return Promise.reject(new Error('网络异常，请稍后重试'))
    }
  }
)


export default request