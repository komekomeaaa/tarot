import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import type { UserContext } from '../types';
import '../styles/input.css';

export const InputPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUserContext, sigilType } = useTarot();

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
            stressLevel: Number(stressLevel),
            goal,
            sigilType: sigilType || ''
        };
        setUserContext(ctx);
        navigate('/select-spread');
    };

    return (
        <div className="page-container input-page">
            <div className="mystic-header">
                <h2>✨ あなたの心の声を、お聞かせください ✨</h2>
            </div>

            {/* 占い師からのメッセージ */}
            <div className="fortune-teller-message">
                <p className="wisdom-text">
                    今、あなたの心に浮かんでいることを<br />
                    そのまま言葉にしてください。
                </p>
                <p className="comfort-text">
                    どんな小さなことでも、どんな大きなことでも、<br />
                    カードたちは優しく受け止めてくれます。
                </p>
            </div>

            {sigilType && (
                <div className="sigil-display">
                    <p className="sigil-message">
                        あなたの魂の輝き: <span className="sigil-type">{sigilType}</span>
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="input-form mystic-form">
                <label>
                    <span className="label-text gentle">🌸 心の風は、どこから吹いていますか？</span>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as UserContext['category'])}
                        className="gentle-select"
                    >
                        <option value="love">💕 恋愛・愛の悩み</option>
                        <option value="work">💼 仕事・天職への道</option>
                        <option value="money">💰 豊かさ・金運</option>
                        <option value="health">🌿 心と体の健康</option>
                        <option value="family">👨‍👩‍👧‍👦 家族・絆</option>
                        <option value="relationship">🤝 人との繋がり</option>
                    </select>
                </label>

                <label>
                    <span className="label-text gentle">🌊 今、どのような風景が広がっていますか？</span>
                    <p className="helper-text">
                        あなたの心に映る景色を、ありのままに教えてください
                    </p>
                    <textarea
                        value={situation}
                        onChange={e => setSituation(e.target.value)}
                        placeholder="例：彼との関係が最近ぎくしゃくしています。言いたいことが言えなくて..."
                        required
                        rows={4}
                        className="gentle-textarea"
                    />
                </label>

                <label>
                    <span className="label-text gentle">⏰ いつまでに、光が欲しいですか？</span>
                    <select
                        value={deadline}
                        onChange={e => setDeadline(e.target.value as UserContext['deadline'])}
                        className="gentle-select"
                    >
                        <option value="today">今日、今すぐ</option>
                        <option value="week">この一週間のうちに</option>
                        <option value="month">今月中には</option>
                        <option value="longer">焦らず、じっくりと</option>
                    </select>
                </label>

                <label>
                    <span className="label-text gentle">💫 この想いの重さを教えてください</span>
                    <p className="helper-text">
                        心の重さには、優劣はありません。素直な気持ちで
                    </p>
                    <div className="stress-slider">
                        <span className="slider-label">そっと</span>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={stressLevel}
                            onChange={e => setStressLevel(Number(e.target.value))}
                            className="gentle-slider"
                        />
                        <span className="slider-label">強く</span>
                    </div>
                    <div className="stress-indicator">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < stressLevel ? 'star filled' : 'star'}>
                                {i < stressLevel ? '⭐' : '☆'}
                            </span>
                        ))}
                    </div>
                </label>

                <label>
                    <span className="label-text gentle">🌟 どのような明日を願っていますか？</span>
                    <p className="helper-text">
                        あなたの心が本当に望む未来を、描いてみてください
                    </p>
                    <input
                        type="text"
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        placeholder="例：笑顔で語り合える、温かい関係に戻りたい..."
                        required
                        className="gentle-input"
                    />
                </label>

                <div className="submit-container">
                    <p className="encouragement-text">
                        準備ができました。カードたちが、あなたを待っています。
                    </p>
                    <button type="submit" className="primary-btn mystic-btn warm-glow">
                        ✨ カードたちに聞いてみる ✨
                    </button>
                </div>
            </form>
        </div>
    );
};
