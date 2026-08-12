import { authApi } from '@/api';
import { useStore } from '@/store';
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './login.css';

interface LoginFormValues {
  account: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useStore(state => state.token);
  const updateToken = useStore(state => state.updateToken);
  const updateUserInfo = useStore(state => state.updateUserInfo);
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/welcome" replace />;

  const handleLogin = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const response = await authApi.login({
        account: values.account.trim(),
        password: values.password,
      });

      updateToken(response.data.token);
      updateUserInfo(response.data.userInfo);

      if (values.remember) {
        localStorage.setItem('rememberedAccount', values.account.trim());
      } else {
        localStorage.removeItem('rememberedAccount');
      }

      message.success(response.message || '登录成功');
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from !== '/login' ? from : '/welcome', { replace: true });
    } catch {
      // 请求拦截器已统一展示后端返回的错误信息。
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
          <h1>让每一次调度，<br />都清晰可控。</h1>
          <p>集中管理订单、司机与运营数据，为运力团队提供可靠的数字化工作台。</p>
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
            <span className="login-kicker">欢迎回来</span>
            <h2>登录管理后台</h2>
            <p>请输入您的账号信息继续访问</p>
          </header>

          <Form<LoginFormValues>
            layout="vertical"
            size="large"
            initialValues={{
              account: localStorage.getItem('rememberedAccount') || '',
              remember: Boolean(localStorage.getItem('rememberedAccount')),
            }}
            onFinish={handleLogin}
            requiredMark={false}
          >
            <Form.Item
              label="用户名或邮箱"
              name="account"
              rules={[{ required: true, whitespace: true, message: '请输入用户名或邮箱' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名或邮箱" autoComplete="username" />
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
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="login-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住账号</Checkbox>
              </Form.Item>
              <span>还没有账号？<a href="/register">立即注册</a></span>
            </div>

            <Button type="primary" htmlType="submit" loading={submitting} block>
              登录
            </Button>
          </Form>

          <footer>© 2026 云程运力调度系统</footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
