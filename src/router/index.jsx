import { createBrowserRouter } from 'react-router-dom'
import BackendLayout from '@/components/backendLayout.jsx'
import DashBoard from '@/views/dashBoard.jsx'
import Consultation from '@/views/Counseling.jsx'
import Emotional from '@/views/emotional.jsx'
import Knowledge from '@/views/knowledge.jsx'
import { Navigate } from 'react-router-dom'
import AuthLayout from '@/components/AuthLayout.jsx'
import Login from '@/views/login.jsx'
import Register from '@/views/register.jsx'
import FrontendLayout from '@/components/frontendLayout.jsx'
import Home from '@/views/home.jsx'
import AiCounseling from '@/views/aiCounseling.jsx'
import EmotionDiary from '@/views/emotionDiary.jsx'
import KnowledgeFront from '@/views/knowledgeFront.jsx'
import KnowledgeDetail from '@/views/KnowledgeDetail.jsx'

// 后台路由配置：定义所有页面路由
const backendRouter = createBrowserRouter([
  // 默认路由：重定向到登录页
  {
    path: '/',
    element: <Navigate to="/front" replace />,
  },
  // 认证路由：包含登录和注册页面
  {
    path: '/Auth',
    element: <AuthLayout />,
    children: [
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
  //前台布局路由：包含前台页面
  {
    path: '/front',
    element: <FrontendLayout />,
    children:[
      {
        index: true,
        element: <Navigate to="/front/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'aiCounseling',
        element: <AiCounseling />,
      },
      {
        path: 'emotionDiary',
        element: <EmotionDiary />,
      },
      {
        path: 'knowledgeFront',
        element: <KnowledgeFront />,
      },
      {
        path: 'knowledge/Article/:id',
        element: <KnowledgeDetail />,
      }
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
        path: 'consultation',
        element: <Consultation />,

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
