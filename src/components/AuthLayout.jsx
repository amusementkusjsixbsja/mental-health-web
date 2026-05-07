import './AuthLayout.css'

import { Outlet } from 'react-router-dom'
import { RobotOutlined } from '@ant-design/icons'

// 认证布局组件：左右分栏布局，左侧展示品牌信息，右侧展示登录/注册表单
function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* 左侧品牌展示区域 */}
      <div className="left-section">
        <div className="auth-content">
          <h1>心理健康ai助手</h1>
          <p>登录后即可使用心理健康ai助手, 为您的心理健康提供支持, 您可以在助手中与ai助手进行互动, 并获得专业的心理健康建议.</p>
          <RobotOutlined className="logo-icon" />
        </div>
      </div>
      {/* 右侧表单内容区域，通过Outlet渲染子路由 */}
      <div className="right-section">
        <Outlet />
      </div>
    </div>
  )
}
export default AuthLayout