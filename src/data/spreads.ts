import type { SpreadDefinition } from '../types';

export const SPREADS: SpreadDefinition[] = [
    {
        id: 'one_card',
        name: 'One Card Oracle',
        positions: [
            { id: 'theme', name: 'Theme', description: '今日のテーマ (Theme of the day)' }
        ]
    },
    {
        id: 'three_card',
        name: 'Three Card Spread',
        positions: [
            { id: 'situation', name: 'Situation', description: '現状 (Current Situation)' },
            { id: 'obstacle', name: 'Obstacle', description: '障害 (Obstacle / Challenge)' },
            { id: 'advice', name: 'Advice', description: '助言 (Advice)' }
        ]
    },
    {
        id: 'celtic_cross',
        name: 'Celtic Cross',
        positions: [
            { id: 'present', name: 'Present', description: '現状' },
            { id: 'challenge', name: 'Challenge', description: '障害・交差' },
            { id: 'foundation', name: 'Foundation', description: '潜在・根・土台' },
            { id: 'past', name: 'Past', description: '過去' },
            { id: 'conscious', name: 'Conscious', description: '顕在意識' },
            { id: 'near_future', name: 'Near Future', description: '近未来' },
            { id: 'self', name: 'Self', description: '自分・態度' },
            { id: 'environment', name: 'Environment', description: '周囲・環境' },
            { id: 'hopes_fears', name: 'Hopes & Fears', description: '願望・恐れ' },
            { id: 'outcome', name: 'Outcome', description: '結果傾向' }
        ]
    }
];
