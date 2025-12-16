// import type { Question } from '../data/questions'; // Unused
import type { SigilCode } from '../types';

type AxisScores = {
    V: number; S: number;
    I: number; C: number;
    E: number; L: number;
    Q: number; D: number;
};

export function calculateSigilType(answers: Array<{ questionId: number, selectedAxis: string }>): SigilCode {
    const scores: AxisScores = {
        V: 0, S: 0,
        I: 0, C: 0,
        E: 0, L: 0,
        Q: 0, D: 0
    };

    answers.forEach(ans => {
        // @ts-ignore
        if (scores[ans.selectedAxis] !== undefined) {
            // @ts-ignore
            scores[ans.selectedAxis] += 1;
        }
    });

    /*
  const axis1 = scores.V >= scores.S ? 'V' : 'S';
  const axis2 = scores.I >= scores.C ? 'I' : 'C'; // Default to I if tie? Or C? Prioritize I (Aether)
  const axis3 = scores.E >= scores.L ? 'E' : 'L'; // E (Chalice)
  const axis4 = scores.Q >= scores.D ? 'Q' : 'D'; // Q (Spark)

  return `${axis1}${axis2}${axis3}${axis4}`;
  */
    // Need to use them:
    return (
        (scores.V >= scores.S ? 'V' : 'S') +
        (scores.I >= scores.C ? 'I' : 'C') +
        (scores.E >= scores.L ? 'E' : 'L') +
        (scores.Q >= scores.D ? 'Q' : 'D')
    );
}

export function getSigilDescription(_code: SigilCode): string {
    // Return description based on code
    // Placeholder logic
    return "Sigil Description Placeholder";
}
