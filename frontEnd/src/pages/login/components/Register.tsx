import { authApi } from '@/api';
import { LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

interface RegisterFormValues {
  userName: string;
  userEmail: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      await authApi.register({
        userName: values.userName.trim(),
        userEmail: values.userEmail.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      message.success('注册成功，请登录');
      navigate('/login');
    } catch {
      // 请求拦截器已统一展示后端返回的错误信息
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-brand">
          <img src="/imgs/YunCheng.png" alt="云程" />
          <span>云程</span>
        </div>
        <div className="login-copy">
          <span className="login-eyebrow">TRANSPORT OPERATIONS</span>
          <h1>
            开启您的<br />
            数字化管理之旅
          </h1>
          <p>注册云程运力调度系统，集中管理订单、司机与运营数据。</p>
          <div className="login-feature">
            <SafetyCertificateOutlined />
            <span>账号认证与接口鉴权，全程保护业务数据</span>
          </div>
        </div>
        <div className="login-orbit login-orbit-one" />
        <div className="login-orbit login-orbit-two" />
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <img src="/imgs/YunCheng.png" alt="云程" />
            <span>云程</span>
          </div>
          <header>
            <span className="login-kicker">新用户注册</span>
            <h2>创建账号</h2>
            <p>填写以下信息完成注册</p>
          </header>

          <Form<RegisterFormValues>
            layout="vertical"
            size="large"
            onFinish={handleRegister}
            requiredMark={false}
          >
            <Form.Item
              label="用户名"
              name="userName"
              rules={[
                { required: true, whitespace: true, message: '请输入用户名' },
                { min: 2, message: '用户名至少 2 位' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" autoComplete="username" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="userEmail"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" autoComplete="email" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少需要 6 位' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={submitting} block>
              注册
            </Button>

            <div className="login-options" style={{ marginTop: 16, justifyContent: 'center' }}>
              <span>
                已有账号？<a href="/login">立即登录</a>
              </span>
            </div>
          </Form>

          <footer>© 2026 云程运力调度系统</footer>
        </div>
      </section>
    </main>
  );
};

export default Register;
