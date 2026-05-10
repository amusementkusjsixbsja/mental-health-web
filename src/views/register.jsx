import '@/views/register.css'

import { Link } from 'react-router-dom'
import { register } from '@/api/admin.jsx'
import { Form, Input, Button, message, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleRegister = (values) => {
    register(values).then((res) => {
      message.success('注册成功', 0.5, () => {
        navigate('/Auth/login')
      })
    }).catch((err) => {
      message.error(err.message || '注册失败，请重试')
    })
  }

  return (
    <div className="login-container">
      <Link to="/Auth/login" className="back-link">
        ←返回登录
      </Link>

      <div className="login-content">
        <h2 className="login-title">创建新账户</h2>
        <p className="login-subtitle">请填写以下信息完成注册</p>

        <Form className="login-form" layout="vertical" form={form} onFinish={handleRegister}>
          <Form.Item
            label={
              <span className="required-label">
                用户名
              </span>
            }
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                邮箱
              </span>
            }
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                手机号
              </span>
            }
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号（选填）" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                昵称
              </span>
            }
            name="nickname"
          >
            <Input placeholder="请输入昵称（选填）" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                性别
              </span>
            }
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="userType" initialValue={1} hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                密码
              </span>
            }
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                确认密码
              </span>
            }
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="login-btn" htmlType="submit">
              注册账户
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link">
          已有账户？
          <Link to="/Auth/login">去登录</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
