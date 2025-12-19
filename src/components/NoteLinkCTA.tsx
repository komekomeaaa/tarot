import React from 'react';
import { getNoteLink } from '../config/note-links';
import '../styles/note-cta.css';

interface NoteLinkCTAProps {
    type: 'sigil' | 'card' | 'spread';
    id: string;
    title: string;
}

/**
 * note記事への誘導コンポーネント
 * URLが設定されている場合のみ表示される
 */
export const NoteLinkCTA: React.FC<NoteLinkCTAProps> = ({ type, id, title }) => {
    const url = getNoteLink(type, id);

    // URLが設定されていない場合は非表示
    if (!url) return null;

    return (
        <div className="note-link-cta">
            <p className="cta-message">
                🔮 {title}の深い意味を知りたい方へ
            </p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="note-link-button"
            >
                noteで詳しく読む →
            </a>
        </div>
    );
};
