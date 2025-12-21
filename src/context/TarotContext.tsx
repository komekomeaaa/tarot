import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SigilCode, UserContext, DrawResult } from '../types';

interface TarotState {
    sigilType: SigilCode | null;
    userContext: UserContext | null;
    lastDraw: DrawResult | null;
    setSigilCode: (code: SigilCode) => void;
    setUserContext: (ctx: UserContext) => void;
    setLastDraw: (draw: DrawResult) => void;
}

const TarotContext = createContext<TarotState | undefined>(undefined);

export const TarotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize from localStorage
    const [sigilType, setSigilCodeState] = useState<SigilCode | null>(() => {
        try {
            const saved = localStorage.getItem('tarot_sigil_type');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const [userContext, setUserContextState] = useState<UserContext | null>(() => {
        try {
            const saved = localStorage.getItem('tarot_user_context');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const [lastDraw, setLastDrawState] = useState<DrawResult | null>(() => {
        try {
            const saved = localStorage.getItem('tarot_last_draw');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // Wrappers to update both state and localStorage
    const setSigilCode = (code: SigilCode) => {
        setSigilCodeState(code);
        localStorage.setItem('tarot_sigil_type', JSON.stringify(code));
    };

    const setUserContext = (ctx: UserContext) => {
        setUserContextState(ctx);
        localStorage.setItem('tarot_user_context', JSON.stringify(ctx));
    };

    const setLastDraw = (draw: DrawResult) => {
        setLastDrawState(draw);
        localStorage.setItem('tarot_last_draw', JSON.stringify(draw));
    };

    return (
        <TarotContext.Provider value={{
            sigilType,
            userContext,
            lastDraw,
            setSigilCode,
            setUserContext,
            setLastDraw
        }}>
            {children}
        </TarotContext.Provider>
    );
};

export const useTarot = () => {
    const context = useContext(TarotContext);
    if (!context) {
        throw new Error('useTarot must be used within a TarotProvider');
    }
    return context;
};
