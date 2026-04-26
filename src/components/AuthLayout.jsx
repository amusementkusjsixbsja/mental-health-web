import './AuthLayout.css'

import { Outlet } from 'react-router-dom'
import { RobotOutlined } from '@ant-design/icons'

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="left-section">
        <div className="auth-content">
          <h1>心理健康ai助手</h1>
          <p>登录后即可使用心理健康ai助手, 为您的心理健康提供支持, 您可以在助手中与ai助手进行互动, 并获得专业的心理健康建议.</p>
          <RobotOutlined className="logo-icon" />
          <img src="" alt="" />
        </div>
      </div>
      <div className="right-section">
        <Outlet />
      </div>
    </div>
  )
}
export default AuthLayout