import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  MessageOutlined,
  HeartOutlined,
  BookOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import './backendLayout.css'

function BackendLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/back/dashboard',
      icon: <DashboardOutlined />,
      label: '数据看板',
    },
    {
      key: '/back/cousutation',
      icon: <MessageOutlined />,
      label: '咨询管理',
    },
    {
      key: '/back/emotional',
      icon: <HeartOutlined />,
      label: '情感分析',
    },
    {
      key: '/back/knowledge',
      icon: <BookOutlined />,
      label: '知识库',
    },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  return (
    <div className="custom-layout">
      {/* 自定义侧边栏 */}
      <aside className={`custom-sider ${collapsed ? 'collapsed' : ''}`}>

        <div className="custom-logo-container">
          <div className="custom-logo">
            <RobotOutlined className="logo-icon" />
            {!collapsed && <span className="logo-text">心理健康助手</span>}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="custom-menu"
          inlineCollapsed={collapsed}
        />
      </aside>

      {/* 主内容区 */}
      <div className="custom-main">
        <header className="custom-header">
          {collapsed ? (
            <MenuUnfoldOutlined
              onClick={() => setCollapsed(false)}
              className="toggle-btn"
            />
          ) : (
            <MenuFoldOutlined
              onClick={() => setCollapsed(true)}
              className="toggle-btn"
            />
          )}
          <Dropdown menu={{ items: userMenuItems }} trigger="hover" placement="bottomRight">
            <span className="user-dropdown">
              <UserOutlined /> Admin <DownOutlined />
            </span>
          </Dropdown>
        </header>
        <main className="custom-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BackendLayout
