import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import 'antd/dist/reset.css'
import App from './App.jsx'
import router from './router/index.jsx'

// 应用入口：初始化React应用并配置路由
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
