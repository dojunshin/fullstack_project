import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUserStore } from '../stores/useUserStore';
import { User } from '../types/userType';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.status === 200) {
        const userData: User = response.data.user;
        const token: string = response.data.accessToken;
        setUser(userData, token);
        api.defaults.headers['authorization'] = 'Bearer ' + token;
        return;
      }
      throw new Error(response?.data?.message || '로그인에 실패했습니다.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (err as { message?: string })?.message ||
        '로그인 중 오류가 발생했습니다.';
      setError(message);
    }
  };

  if (user) return null;

  return (
    <div className="login-container">
      {error && <div className="login-error">{error}</div>}
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">로그인</h1>
        <div className="login-field">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">로그인</button>
      </form>
    </div>
  );
}
