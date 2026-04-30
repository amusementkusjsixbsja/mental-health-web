import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import BackendLayout from '../components/backendLayout.jsx'
import DashBoard from '../views/dashBoard.jsx'
import Cousutation from '../views/cousutation.jsx'
import Emotional from '../views/emotional.jsx'
import Knowledge from '../views/knowledge.jsx'
import { Navigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Login from '../views/login.jsx'
import Register from '../views/register.jsx'

// 后台路由配置：定义所有页面路由
const backendRouter = createBrowserRouter([
  // 默认路由：重定向到登录页
  {
    path: '/',
    element: <Navigate to="/Auth/login" replace />,
  },
  // 认证路由：包含登录和注册页面
  {
    path: '/Auth',
    element: <AuthLayout />,
    children: [
      // 默认子路由：重定向到登录页
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: 'login',
        element: <Login />,

      },
      {
        path: 'register',
        element: <Register />,
      },
    ]
  },
  // 后台管理路由：包含数据看板、咨询管理、情感分析、知识库等页面
  {
    path: '/back',
    element: <BackendLayout />,
    children: [
      // 默认子路由：重定向到仪表盘页面
      {
        index: true,
        element: <Navigate to="/back/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashBoard />,
      },
      {
        path: 'cousutation',
        element: <Cousutation />,

      },
      {
        path: 'emotional',
        element: <Emotional />,
      },
      {
        path: 'knowledge',
        element: <Knowledge />,
      },
    ],
  },

])

export default backendRouter
