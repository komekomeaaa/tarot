import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import { drawCards } from '../logic/deck';
import '../styles/spread.css';

export const SpreadSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { setLastDraw } = useTarot();

    const handleStartReading = () => {
        const drawn = drawCards(10);

        const positions = [
            'present', 'challenge', 'foundation', 'past', 'conscious',
            'near_future', 'self', 'environment', 'hopes_fears', 'outcome'
        ];
        drawn.forEach((d, i) => {
            if (positions[i]) d.positionId = positions[i];
        });

        setLastDraw({
            spreadId: 'celtic_cross',
            drawDate: new Date().toISOString(),
            cards: drawn
        });

        navigate('/result');
    };

    return (
        <div className="page-container spread-page">
            <div className="mystic-header">
                <h2>✝️ ケルト十字</h2>
                <p className="header-subtitle">人生の複雑な問題を、深く読み解く10枚のスプレッド</p>
            </div>

            <div className="spread-details">
                <div className="guide-section">
                    <h4>📖 この展開法について</h4>
                    <p className="description">
                        タロット展開法の王様。10枚のカードが、あなたの状況を多角的に照らし出します。
                    </p>
                    <p className="description benefits-title">
                        <strong>【得られるものは主に3つ】</strong>
                    </p>
                    <ul className="benefits-list">
                        <li><strong>いま何が起きているか（整理）</strong></li>
                        <li><strong>どこが引っかかっているか（盲点）</strong></li>
                        <li><strong>次に何をすると流れが変わるか（ヒント）</strong></li>
                    </ul>
                </div>

                <div className="guide-section time-section">
                    <h4>⏳ 所要時間の目安</h4>
                    <p className="time-estimate"><strong>3〜5分</strong>（じっくり読むなら10分ほど）</p>
                </div>

                <div className="guide-section">
                    <h4>🎴 カードの位置と意味</h4>
                    <ul className="positions-list">
                        <li>1️⃣ 現在の核心 - 今の状況の中心</li>
                        <li>2️⃣ 障害・交差 - 乗り越えるべき課題</li>
                        <li>3️⃣ 根・土台 - 問題の根本原因（無意識の背景）</li>
                        <li>4️⃣ 過去 - 去りつつある影響</li>
                        <li>5️⃣ 顕在意識 - あなたが意識している想い</li>
                        <li>6️⃣ 近未来 - 数週間〜数ヶ月先の流れ</li>
                        <li>7️⃣ 自分自身 - あなたの態度・姿勢</li>
                        <li>8️⃣ 周囲の影響 - 環境や他者からの影響</li>
                        <li>9️⃣ 願望と恐れ - 心の深層</li>
                        <li>🔟 最終結果 - <strong>現時点の流れの延長で起こりやすい方向</strong>（行動で変化します）</li>
                    </ul>
                </div>

                <div className="guide-section">
                    <h4>💫 占い方のヒント</h4>
                    <p className="guidance">
                        10枚のカードは複雑に絡み合います。焦らず一枚ずつ、そして全体の流れを読み取りましょう。このスプレッドは、人生の岐路に立つあなたを深く導きます。
                    </p>
                </div>

                <div className="guide-section reversed-info">
                    <h4>🔄 逆位置について</h4>
                    <p className="reversed-meaning">
                        逆位置は、正位置の「影」や「内向きの力」、または<strong>過不足・遅れ・未熟さ</strong>を表すことがあります。
                    </p>
                    <p className="reversed-meaning">
                        例えば「力」が逆位置なら、外に押すより、<strong>内なる強さを育てる時期</strong>という意味になります。悪い意味とは限りません。
                    </p>
                </div>

                <div className="guide-section warning-section">
                    <h4>⚠️ 大切なこと</h4>
                    <p className="warning-text">
                        これは未来の確定ではなく、<strong>今の状態を映す"地図"</strong>です。
                    </p>
                    <p className="warning-text">
                        強い不調や危険を感じる場合は、占いだけで判断せず、医療・公的窓口などへの相談も検討してください。
                    </p>
                </div>
            </div>

            <div className="start-reading-container">
                <p className="encouragement">
                    心を静めて、質問を心の中で一文にしてから、カードをめくりましょう。
                </p>
                <button
                    onClick={handleStartReading}
                    className="primary-btn mystic-btn warm-glow draw-btn"
                >
                    ✨ カードをめくる ✨
                </button>
            </div>
        </div>
    );
};
