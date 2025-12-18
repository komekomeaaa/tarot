import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import { EXTENDED_QUESTIONS, LIKERT_OPTIONS } from '../data/questions-extended';
import { calculateExtendedSigilType, type ExtendedAnswer } from '../logic/diagnosis';
import '../styles/onboarding.css';

export const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { setSigilCode } = useTarot();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<ExtendedAnswer[]>([]);

    const currentQuestion = EXTENDED_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / EXTENDED_QUESTIONS.length) * 100;

    // 進捗に応じた励ましのメッセージ
    const getEncouragementMessage = () => {
        const q = currentQuestionIndex + 1;
        if (q === 1) return '始まりの一歩です';
        if (q === 10) return '心の扉が少しずつ開いています';
        if (q === 20) return 'あなたの本質が見えてきました';
        if (q === 30) return 'もうすぐ真実に辿り着きます';
        if (q === 39) return '最後の一歩です';
        if (q === 40) return 'すべての問いが、答えになります';
        return 'あなたの輝きを探しています';
    };

    const handleAnswer = (score: number) => {
        const newAnswer: ExtendedAnswer = {
            questionId: currentQuestion.id,
            axis: currentQuestion.axis,
            score
        };

        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);

        if (currentQuestionIndex < EXTENDED_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 診断完了
            const sigilType = calculateExtendedSigilType(newAnswers);
            setSigilCode(sigilType);
            navigate('/input');
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    return (
        <div className="page-container onboarding-page">
            <div className="mystic-header">
                <h2>✨ あなたの魂の輝きを見つけましょう ✨</h2>
            </div>

            {/* 優しい導入文 */}
            {currentQuestionIndex === 0 && (
                <div className="welcome-message">
                    <p className="wisdom-text">
                        これから40の問いかけが、<br />
                        あなたの内なる真実へと導きます。
                    </p>
                    <p className="comfort-text">
                        正解はありません。<br />
                        心の声に、素直に耳を傾けてください。
                    </p>
                </div>
            )}

            {/* プログレスバー */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <div className="progress-info">
                    <span className="progress-number">{currentQuestionIndex + 1} / {EXTENDED_QUESTIONS.length}</span>
                    <span className="encouragement">{getEncouragementMessage()}</span>
                </div>
            </div>

            {/* 質問 */}
            <div className="question-container">
                <h3 className="question-text">{currentQuestion.text}</h3>

                {/* 5択オプション */}
                <div className="options-container">
                    {LIKERT_OPTIONS.map((option) => (
                        <button
                            key={option.score}
                            onClick={() => handleAnswer(option.score)}
                            className="option-btn gentle-option"
                        >
                            <span className="option-emoji">{option.emoji}</span>
                            <span className="option-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 戻るボタン */}
            {currentQuestionIndex > 0 && (
                <div className="navigation">
                    <button onClick={handleBack} className="back-btn gentle-back">
                        ← 前の問いに戻る
                    </button>
                </div>
            )}

            {/* ヒント */}
            <div className="hint-text">
                <p>💫 深呼吸をして、心に響く答えを選んでください</p>
            </div>
        </div>
    );
};
