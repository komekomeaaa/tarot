import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SigilCode, UserContext, DrawResult } from '../types';

interface TarotState {
    sigilCode: SigilCode | null;
    userContext: UserContext | null;
    lastDraw: DrawResult | null;
    setSigilCode: (code: SigilCode) => void;
    setUserContext: (ctx: UserContext) => void;
    setLastDraw: (draw: DrawResult) => void;
}

const TarotContext = createContext<TarotState | undefined>(undefined);

export const TarotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sigilCode, setSigilCode] = useState<SigilCode | null>(null);
    const [userContext, setUserContext] = useState<UserContext | null>(null);
    const [lastDraw, setLastDraw] = useState<DrawResult | null>(null);

    // Load from local storage on mount? (Optional for MVP)

    return (
        <TarotContext.Provider value={{
            sigilCode,
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
