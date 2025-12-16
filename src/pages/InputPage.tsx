import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import type { UserContext } from '../types';

export const InputPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUserContext, sigilCode } = useTarot();

    const [category, setCategory] = useState<UserContext['category']>('love');
    const [situation, setSituation] = useState('');
    const [deadline, setDeadline] = useState<UserContext['deadline']>('week');
    const [stressLevel, setStressLevel] = useState(3);
    const [goal, setGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ctx: UserContext = {
            category,
            situation,
            deadline,
            stressLevel,
            goal,
            sigilCode: sigilCode || undefined
        };
        setUserContext(ctx);
        navigate('/select-spread');
    };

    return (
        <div className="page-container input-page">
            <div className="mystic-header">
                <h2>✧ 占いの準備 ✧</h2>
            </div>
            {sigilCode && <p className="sigil-badge">あなたのシジル: <strong>{sigilCode}</strong></p>}

            <form onSubmit={handleSubmit} className="input-form mystic-form">
                <label>
                    <span className="label-text">🔮 相談カテゴリ</span>
                    <select value={category} onChange={(e) => setCategory(e.target.value as UserContext['category'])}>
                        <option value="love">恋愛・人間関係</option>
                        <option value="work">仕事・キャリア</option>
                        <option value="money">金運・財運</option>
                        <option value="health">健康・体調</option>
                        <option value="family">家族・家庭</option>
                        <option value="human_relations">対人関係</option>
                    </select>
                </label>

                <label>
                    <span className="label-text">📜 今の状況</span>
                    <textarea
                        value={situation}
                        onChange={e => setSituation(e.target.value)}
                        placeholder="今、何に悩んでいますか？どんな状況ですか？"
                        required
                    />
                </label>

                <label>
                    <span className="label-text">⏳ いつまでに知りたい？</span>
                    <select value={deadline} onChange={e => setDeadline(e.target.value as UserContext['deadline'])}>
                        <option value="today">今日中</option>
                        <option value="week">今週中</option>
                        <option value="month">今月中</option>
                        <option value="3months">3ヶ月以内</option>
                    </select>
                </label>

                <label>
                    <span className="label-text">💫 悩みの深さ</span>
                    <div className="stress-slider">
                        <span>軽い</span>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={stressLevel}
                            onChange={e => setStressLevel(Number(e.target.value))}
                        />
                        <span>深刻</span>
                    </div>
                    <div className="stress-indicator">{"★".repeat(stressLevel)}{"☆".repeat(5 - stressLevel)}</div>
                </label>

                <label>
                    <span className="label-text">🌟 どうなりたい？（願望）</span>
                    <input
                        type="text"
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        placeholder="理想の未来を思い描いてください"
                        required
                    />
                </label>

                <button type="submit" className="primary-btn mystic-btn">
                    ✦ カードを引く ✦
                </button>
            </form>
        </div>
    );
};
