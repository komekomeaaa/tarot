import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../config/aws-config';
import '../styles/auth.css';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }

        if (password.length < 8) {
            setError('パスワードは8文字以上必要です');
            return;
        }

        setLoading(true);

        try {
            await authApi.signUp(username, password);
            navigate('/login', { state: { message: '登録完了！ログインしてください。' } });
        } catch (err: any) {
            setError(err.message || '登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>🌟 新規登録 🌟</h1>
                    <p className="auth-subtitle">あなただけの占いの旅が始まります</p>
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
                        <small className="form-hint">メールアドレスは不要です</small>
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
                            minLength={8}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">パスワード（確認）</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="もう一度入力"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-btn primary" disabled={loading}>
                        {loading ? '登録中...' : '登録する'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>すでにアカウントをお持ちの方は</p>
                    <Link to="/login" className="auth-link">ログインはこちら</Link>
                </div>
            </div>
        </div>
    );
};
