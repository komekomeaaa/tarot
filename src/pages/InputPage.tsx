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
    const [stressLevel, setStressLevel] = useState(3);
    const [goal, setGoal] = useState('');

    const [isLimited, setIsLimited] = useState(false);
    const [nextAvailableDate, setNextAvailableDate] = useState('');

    // マウント時に月一制限をチェック
    React.useEffect(() => {
        const lastReading = localStorage.getItem('tarot_last_reading_time');
        if (lastReading) {
            const lastDate = new Date(lastReading);
            const now = new Date();

            // 同じ月かどうか判定
            if (lastDate.getFullYear() === now.getFullYear() &&
                lastDate.getMonth() === now.getMonth()) {

                setIsLimited(true);

                // 来月の1日を計算
                const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                setNextAvailableDate(`${nextMonth.getMonth() + 1}月1日`);
            }
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ctx: UserContext = {
            category,
            situation,
            deadline: 'week', // デフォルト値
            stressLevel: Number(stressLevel),
            goal,
            sigilType: sigilType || ''
        };
        setUserContext(ctx);
        navigate('/select-spread');
    };

    if (isLimited) {
        return (
            <div className="page-container input-page">
                <div className="mystic-header">
                    <h2>🌿 今月の運勢は受け取り済みです 🌿</h2>
                </div>
                <div className="fortune-teller-message" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p className="wisdom-text">
                        カードの声は、ひと月に一度だけ。<br />
                        今は受け取った言葉を胸に、日々を過ごす時です。
                    </p>
                    <p className="comfort-text" style={{ marginTop: '2rem' }}>
                        次の運勢は <strong>{nextAvailableDate}</strong> から受け取れます。<br />
                        あなたの歩む道が、光に照らされていますように。
                    </p>

                    <div style={{ marginTop: '3rem' }}>
                        <button
                            onClick={() => navigate('/result')}
                            className="secondary-btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-accent-gold)',
                                color: 'var(--color-text-gold)',
                                padding: '1rem 2rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            📜 先回の結果を見直す
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <span className="label-text gentle">🌸 いまの心の状態を、ひと言で教えてください</span>
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
                        あなたの心に映る景色を、ありのままに教えてください<br />
                        <span className="focus-tip">💡 質問を1つに絞るほど、答えが鋭くなります</span>
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
                    <span className="label-text gentle">💫 いまの重さを教えてください（優劣はありません）</span>
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
                    <span className="label-text gentle">🌟 どのような未来を願っていますか？</span>
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
                    <button type="submit" className="primary-btn mystic-btn warm-glow">
                        ✨ カードたちに聞いてみる ✨
                    </button>
                </div>
            </form>
        </div>
    );
};
