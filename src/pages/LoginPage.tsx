import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, tokenStorage } from '../config/aws-config';
import '../styles/auth.css';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authApi.signIn(username, password);
            tokenStorage.setToken(result.token);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>✨ ログイン ✨</h1>
                    <p className="auth-subtitle">あなたの占いの旅を続けましょう</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">ユーザー名</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="お好きなユーザー名"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">パスワード</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8文字以上"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? '確認中...' : 'ログイン'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>アカウントをお持ちでない方は</p>
                    <Link to="/signup" className="auth-link">新規登録はこちら</Link>
                </div>

                <div className="auth-skip">
                    <button onClick={() => navigate('/')} className="skip-btn">
                        ログインせずに試す
                    </button>
                </div>
            </div>
        </div>
    );
};
