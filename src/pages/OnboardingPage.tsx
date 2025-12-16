import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import { calculateSigilType } from '../logic/diagnosis';
import { useTarot } from '../context/TarotContext';

export const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { setSigilCode } = useTarot();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Array<{ questionId: number, selectedAxis: string }>>([]);

    const currentQuestion = QUESTIONS[currentQIndex];

    const handleAnswer = (axis: string) => {
        const newAnswers = [...answers, { questionId: currentQuestion.id, selectedAxis: axis }];
        setAnswers(newAnswers);

        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            const code = calculateSigilType(newAnswers);
            setSigilCode(code);
            navigate('/input');
        }
    };

    return (
        <div className="page-container onboarding-page">
            <div className="mystic-header">
                <span className="star">☆</span>
                <h2>あなたのシジルを発見する</h2>
                <span className="star">☆</span>
            </div>
            <p className="intro-text">
                16の問いに答えることで、あなたの魂のシジル（刻印）が明らかになります。
                直感に従ってお選びください。
            </p>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}></div>
            </div>
            <p className="progress-text">Q{currentQIndex + 1} / {QUESTIONS.length}</p>

            <div className="question-card">
                <div className="card-glow"></div>
                <h3>{currentQuestion.text}</h3>
                <div className="options">
                    <button className="option-btn" onClick={() => handleAnswer(currentQuestion.optionA.axis)}>
                        {currentQuestion.optionA.text}
                    </button>
                    <button className="option-btn" onClick={() => handleAnswer(currentQuestion.optionB.axis)}>
                        {currentQuestion.optionB.text}
                    </button>
                </div>
            </div>

            <div className="skip-section">
                <button onClick={() => {
                    setSigilCode('VIEQ');
                    navigate('/input');
                }} className="skip-btn">
                    診断をスキップする →
                </button>
            </div>
        </div>
    );
};
