export const mockEvaluations = {
    total_evaluations: 3,
    evaluations: [
        {
            evaluation_id: 'aa971957-258e-4e0a-a77a-92fb042588e1',
            user_id: 'e0dce9fc-a8e1-4479-91ab-0ae45a97025b',
            conversation_id: '33f4e0a5-07df-4272-8406-b79f7fd21fd3',
            session_id: '0912193c-b75f-47cf-9724-1c44656a62f3',
            a1_score: 8,
            a2_score: 7,
            a3_score: 9,
            a4_score: 6,
            a5_score: 8,
            b6_score: 7,
            b7_score: 8,
            b8_score: 6,
            c9_score: 9,
            c10_score: 8,
            total_score: 80,
            verdict: 'PASS',
            rapport_safety: true,
            context_reinstatement: true,
            free_recall: true,
            varied_focused_retrieval: false,
            closure: true,
            open_rate: 0.6,
            leading_rate: 0.1,
            emotion_regulation: 0.82,
            active_listening: 'good',
            neutral_language: 'good',
            contamination_risk: 'low',
            pacing_ok: 'good',
            trauma_informed: 'good',
            question_classifications: [
                { text: 'Tell me what happened in your own words', label: 'open-ended' },
                { text: 'You were upset, weren’t you?', label: 'leading' }
            ],
            coaching_feedback: [
                { area: 'Questioning style', tip: 'Reduce leading questions' },
                { area: 'Pacing', tip: 'Allow longer pauses' }
            ],
            created_at: '2025-09-06T13:55:17.151686',
            updated_at: '2025-09-06T13:55:17.151686'
        },
        {
            evaluation_id: 'aa971957-258e-4e0a-a77a-92fb042588e1',
            user_id: 'e0dce9fc-a8e1-4479-91ab-0ae45a97025b',
            conversation_id: '33f4e0a5-07df-4272-8406-b79f7fd21fd3',
            session_id: '0912193c-b75f-47cf-9724-1c44656a62f3',
            a1_score: 8,
            a2_score: 7,
            a3_score: 9,
            a4_score: 6,
            a5_score: 8,
            b6_score: 7,
            b7_score: 8,
            b8_score: 6,
            c9_score: 9,
            c10_score: 8,
            total_score: 92,
            verdict: 'PASS',
            rapport_safety: true,
            context_reinstatement: true,
            free_recall: true,
            varied_focused_retrieval: false,
            closure: true,
            open_rate: 0.6,
            leading_rate: 0.1,
            emotion_regulation: 0.82,
            active_listening: 'good',
            neutral_language: 'good',
            contamination_risk: 'low',
            pacing_ok: 'good',
            trauma_informed: 'good',
            question_classifications: [
                { text: 'Tell me what happened in your own words', label: 'open-ended' },
                { text: 'You were upset, weren’t you?', label: 'leading' }
            ],
            coaching_feedback: [
                { area: 'Questioning style', tip: 'Reduce leading questions' },
                { area: 'Pacing', tip: 'Allow longer pauses' }
            ],
            created_at: '2025-09-15T13:55:17.151686',
            updated_at: '2025-09-15T13:55:17.151686'
        },
        {
            evaluation_id: 'aa971957-258e-4e0a-a77a-92fb042588e1',
            user_id: 'e0dce9fc-a8e1-4479-91ab-0ae45a97025b',
            conversation_id: '33f4e0a5-07df-4272-8406-b79f7fd21fd3',
            session_id: '0912193c-b75f-47cf-9724-1c44656a62f3',
            a1_score: 8,
            a2_score: 7,
            a3_score: 9,
            a4_score: 6,
            a5_score: 8,
            b6_score: 7,
            b7_score: 8,
            b8_score: 6,
            c9_score: 9,
            c10_score: 8,
            total_score: 68,
            verdict: 'FAIL',
            rapport_safety: true,
            context_reinstatement: true,
            free_recall: true,
            varied_focused_retrieval: false,
            closure: true,
            open_rate: 0.6,
            leading_rate: 0.1,
            emotion_regulation: 0.82,
            active_listening: 'good',
            neutral_language: 'good',
            contamination_risk: 'low',
            pacing_ok: 'good',
            trauma_informed: 'good',
            question_classifications: [
                { text: 'Tell me what happened in your own words', label: 'open-ended' },
                { text: 'You were upset, weren’t you?', label: 'leading' }
            ],
            coaching_feedback: [
                { area: 'Questioning style', tip: 'Reduce leading questions' },
                { area: 'Pacing', tip: 'Allow longer pauses' }
            ],
            created_at: '2025-10-02T13:55:17.151686',
            updated_at: '2025-10-02T13:55:17.151686'
        }
    ]
}

export const mockVerdicts = {
    verdict_statistics: {
        pass: 7,
        fail: 3,
        borderline: 2
    }
}

export const mockEmotionRegulations = {
    emotion_regulation_statistics: {
        pass: 10,
        fair: 5,
        poor: 3
    }
}

export const mockOpenRates = {
    open_rate_statistics: {
        pass: 5,
        fair: 10,
        poor: 1
    }
}

export const mockA3ScoreDistribution = {
    a3_score_distribution: [
        { score: 0, frequency: 2 },
        { score: 8, frequency: 1 },
        { score: 16, frequency: 1 },
        { score: 20, frequency: 6 }
    ],
    total_evaluations: 10,
    unique_scores: 4
}
