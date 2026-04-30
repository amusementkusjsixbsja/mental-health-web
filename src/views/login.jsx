import './login.css'

import { Link } from 'react-router-dom'
import { login } from '@/api/admin.jsx'
import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'

// 登录页面：用户身份验证和路由跳转
function Login() {
  // 获取表单实例和路由导航函数
  const [form] = Form.useForm()
  const navigate = useNavigate()

  // 处理登录表单提交
  const handleLogin = (values) => {
    login(values).then((res) => {
      // 登录成功，保存token和用户信息到本地存储
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        // 根据用户类型进行路由跳转（userType=2为管理员）
        if (res.userInfo.userType === 2) {
          // 显示成功提示，0.5秒后跳转到仪表盘页面
          message.success('登录成功', 0.5, () => {
            navigate('/back/dashboard')
          })
        } else {
          // 其他用户类型的跳转逻辑待实现
        }

      }
    }).catch((err) => {
      // 登录失败提示
      message.error(err.message || '用户名或密码错误')
    })
  }

  return (
    <div className="login-container">
      {/* 返回首页链接 */}
      <Link to="/" className="back-link">
        ←返回首页
      </Link>

      <div className="login-content">
        <h2 className="login-title">登录您的账户</h2>
        <p className="login-subtitle">请输入您的登录信息</p>

        {/* 登录表单：包含用户名和密码输入框 */}
        <Form className="login-form" layout="vertical" form={form} onFinish={handleLogin}>
          <Form.Item
            label={
              <span className="required-label">
                用户名或邮箱
              </span>
            }
            name="username"
            rules={[{ required: true, message: '请输入用户名或邮箱' }]}
          >
            <Input placeholder="请输入用户名或邮箱" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                密码
              </span>
            }
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="login-btn" htmlType="submit">
              登录账户
            </Button>
          </Form.Item>
        </Form>

        {/* 注册跳转链接 */}
        <div className="register-link">
          还没有账户？
          <Link to="/Auth/register">去注册</Link>
        </div>
      </div>
    </div>
  )
}

export default Login