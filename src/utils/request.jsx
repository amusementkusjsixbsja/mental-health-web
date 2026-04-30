import axios from 'axios'
import { message } from 'antd'

// 创建axios请求实例，配置基础URL和超时时间
const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器：在发送请求前添加token
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取token并添加到请求头
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

// 响应拦截器：统一处理响应数据和错误
request.interceptors.response.use(
  (response) => {
    const { data } = response
    // 请求成功（状态码200），返回data字段
    if (data.code == 200) {
      return data.data
    } else {
      // 业务错误，抛出异常信息
      return Promise.reject(new Error(data.message || data.msg || '请求失败'))
    }
  },
  (error) => {
    // 处理HTTP错误响应
    if (error.response) {
      const status = error.response.status
      // 401未授权：清除本地存储并跳转登录页
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/Auth/login'
        return Promise.reject(error)
      }
      return Promise.reject(new Error(error.response.data?.message || error.response.data?.msg || '网络请求失败'))
    } else {
      // 网络异常错误
      return Promise.reject(new Error('网络异常，请稍后重试'))
    }
  }
)


export default request