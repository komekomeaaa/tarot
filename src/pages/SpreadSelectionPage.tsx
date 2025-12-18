import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import type { SpreadType } from '../types';
import { drawCards } from '../logic/deck';
import { SPREADS } from '../data/spreads';

const SPREAD_INFO: Record<SpreadType, {
    name: string;
    icon: string;
    tagline: string;
    description: string;
    positions: string[];
    guidance: string;
    reversedMeaning: string;
}> = {
    one_card: {
        name: 'ワンカード',
        icon: '🃏',
        tagline: '今日のメッセージ・シンプルな答え',
        description: '最もシンプルで、それゆえに深い展開法。一枚のカードが、今のあなたに必要なメッセージを伝えます。日々の指針や、YesNoの答えを求める時に。',
        positions: [
            '💫 テーマ - カードが示す今日のメッセージ'
        ],
        guidance: '心を静めて、今最も知りたいことを思い浮かべてください。カードは、あなたの潜在意識が既に知っている答えを映し出します。',
        reversedMeaning: '逆位置（上下が逆）のカードは、そのカードの力が「内向き」に働いていることを示します。ネガティブではなく、「まだ表に出ていない」「準備段階」という意味です。'
    },
    three_card: {
        name: 'スリーカード',
        icon: '🎴',
        tagline: '過去・現在・未来の流れを読む',
        description: '時の流れを三枚のカードで読み解きます。過去の影響、現在の状況、未来の可能性が明らかになります。恋愛、仕事、人間関係など、あらゆる相談に対応できる万能な展開法です。',
        positions: [
            '🌑 左（過去）- 現状を作り出した過去の出来事や影響',
            '🌕 中央（現在）- 今あなたが直面している状況・課題',
            '🌟 右（未来）- このまま進んだ場合の可能性・アドバイス'
        ],
        guidance: '三枚のカードは、一つの物語を紡ぎます。過去から現在への流れを理解し、未来へのヒントを受け取りましょう。未来は変えられます。',
        reversedMeaning: '逆位置のカードは、その位置のエネルギーが「抑制されている」「内省を促す」サインです。例えば未来の位置で逆位置なら、「急がず、今は内側を見つめる時」という意味になります。'
    },
    celtic_cross: {
        name: 'ケルト十字',
        icon: '✝️',
        tagline: '人生の複雑な問題を深く読み解く',
        description: 'タロット展開法の王様。10枚のカードが、あなたの状況を多角的に照らし出します。過去・現在・未来だけでなく、潜在意識、周囲の影響、恐れと希望まで明らかにします。',
        positions: [
            '1️⃣ 現在の核心 - 今の状況の中心',
            '2️⃣ 障害・交差 - 乗り越えるべき課題',
            '3️⃣ 根・土台 - 問題の根本原因',
            '4️⃣ 過去 - 去りつつある影響',
            '5️⃣ 顕在意識 - あなたが意識している想い',
            '6️⃣ 近未来 - 数週間〜数ヶ月先',
            '7️⃣ 自分自身 - あなたの態度・姿勢',
            '8️⃣ 周囲の影響 - 環境や他者からの影響',
            '9️⃣ 願望と恐れ - 心の深層',
            '🔟 最終結果 - 辿り着く可能性'
        ],
        guidance: '10枚のカードは複雑に絡み合います。焦らず一枚ずつ、そして全体の流れを読み取りましょう。このスプレッドは、人生の岐路に立つあなたを深く導きます。',
        reversedMeaning: '逆位置は、正位置の「影」や「内向きの力」を表します。例えば「力」のカードが逆位置なら、外に向ける力ではなく、内なる強さを育てる時期という意味になります。悪い意味ではありません。'
    }
};

export const SpreadSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { setLastDraw } = useTarot();
    const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);

    const handleSelectSpread = (spreadId: SpreadType) => {
        let count = 0;
        if (spreadId === 'one_card') count = 1;
        if (spreadId === 'three_card') count = 3;
        if (spreadId === 'celtic_cross') count = 10;

        const drawn = drawCards(count);

        if (spreadId === 'three_card') {
            drawn[0].positionId = 'situation';
            drawn[1].positionId = 'obstacle';
            drawn[2].positionId = 'advice';
        } else if (spreadId === 'one_card') {
            drawn[0].positionId = 'theme';
        } else if (spreadId === 'celtic_cross') {
            const positions = [
                'present', 'challenge', 'foundation', 'past', 'conscious',
                'near_future', 'self', 'environment', 'hopes_fears', 'outcome'
            ];
            drawn.forEach((d, i) => {
                if (positions[i]) d.positionId = positions[i];
            });
        }

        setLastDraw({
            spreadId,
            drawDate: new Date().toISOString(),
            cards: drawn
        });

        navigate('/result');
    };

    return (
        <div className="page-container spread-page">
            <div className="mystic-header">
                <h2>✨ スプレッドを選ぶ ✨</h2>
                <p className="header-subtitle">カードの並べ方が、読み解きの深さを決めます</p>
            </div>

            <p className="intro-text">
                問いの深さに応じて、ふさわしい展開法をお選びください。<br />
                迷ったら、スリーカードがおすすめです。
            </p>

            <div className="spread-options">
                {SPREADS.map(spread => {
                    const info = SPREAD_INFO[spread.id];
                    const isSelected = selectedSpread === spread.id;

                    return (
                        <div key={spread.id} className="spread-option-container">
                            <button
                                className={`spread-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedSpread(isSelected ? null : spread.id)}
                            >
                                <span className="spread-icon">{info.icon}</span>
                                <h3>{info.name}</h3>
                                <p className="tagline">{info.tagline}</p>
                                <span className="learn-more">
                                    {isSelected ? '▲ 閉じる' : '▼ 詳しく見る'}
                                </span>
                            </button>

                            {isSelected && (
                                <div className="spread-guide fade-in">
                                    <div className="guide-section">
                                        <h4>📖 この展開法について</h4>
                                        <p className="description">{info.description}</p>
                                    </div>

                                    <div className="guide-section">
                                        <h4>🎴 カードの位置と意味</h4>
                                        <ul className="positions-list">
                                            {info.positions.map((pos, idx) => (
                                                <li key={idx}>{pos}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="guide-section">
                                        <h4>💫 占い方のヒント</h4>
                                        <p className="guidance">{info.guidance}</p>
                                    </div>

                                    <div className="guide-section reversed-info">
                                        <h4>🔄 逆位置について</h4>
                                        <p className="reversed-meaning">{info.reversedMeaning}</p>
                                    </div>

                                    <button
                                        onClick={() => handleSelectSpread(spread.id)}
                                        className="primary-btn mystic-btn warm-glow draw-btn"
                                    >
                                        ✨ {info.name}で占う ✨
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
