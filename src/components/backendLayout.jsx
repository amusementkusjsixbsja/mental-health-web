import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Dropdown, message } from 'antd'
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

// 后台管理布局组件：包含侧边栏导航、顶部栏和内容区域
function BackendLayout() {
  // 控制侧边栏展开/折叠状态
  const [collapsed, setCollapsed] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollTop = useRef(0)
  const layoutRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // 处理用户退出登录
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    message.success('退出登录成功')
    navigate('/Auth/login')
  }

  // 用户下拉菜单项配置
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  // 处理用户菜单点击事件
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
    }
  }

  // 侧边栏导航菜单配置
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

  // 监听 layout 滚动，向下滚动隐藏顶栏，向上滚动显示
  useEffect(() => {
    const layout = layoutRef.current
    if (!layout) return

    const handleScroll = () => {
      const scrollTop = layout.scrollTop
      const delta = scrollTop - lastScrollTop.current

      if (delta > 5 && scrollTop > 64) {
        setHeaderHidden(true)
      } else if (delta < -5 || scrollTop <= 64) {
        setHeaderHidden(false)
      }

      lastScrollTop.current = scrollTop
    }

    layout.addEventListener('scroll', handleScroll, { passive: true })
    return () => layout.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="custom-layout" ref={layoutRef}>
      {/* 自定义侧边栏：包含Logo和导航菜单 */}
      <aside className={`custom-sider ${collapsed ? 'collapsed' : ''}`}>

        <div className="custom-logo-container">
          <div className="custom-logo">
            <RobotOutlined className="sidebar-logo-icon" />
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

      {/* 主内容区：包含顶部栏和子路由出口 */}
      <div className="custom-main">
        <header className={`custom-header ${headerHidden ? 'header-hidden' : ''}`}>
          {/* 侧边栏折叠/展开按钮 */}
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
          {/* 用户下拉菜单 */}
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger="hover" placement="bottomRight">
            <span className="user-dropdown">
              <UserOutlined /> Admin <DownOutlined />
            </span>
          </Dropdown>
        </header>
        {/* 子路由内容渲染区域 */}
        <main className="custom-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BackendLayout
