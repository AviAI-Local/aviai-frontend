export type QuestionClassification = {
    text: string
    label: string
}

export type CoachingFeedback = {
    area: string
    tip: string
}

export type Evaluation = {
    evaluation_id: string
    user_id: string
    conversation_id: string
    session_id: string
    a1_score: number
    a2_score: number
    a3_score: number
    a4_score: number
    a5_score: number
    b6_score: number
    b7_score: number
    b8_score: number
    c9_score: number
    c10_score: number
    total_score: number
    verdict: string
    rapport_safety: boolean
    context_reinstatement: boolean
    free_recall: boolean
    varied_focused_retrieval: boolean
    closure: boolean
    open_rate: number
    leading_rate: number
    emotion_regulation: number
    active_listening: string
    neutral_language: string
    contamination_risk: string
    pacing_ok: string
    trauma_informed: string
    question_classifications: QuestionClassification[]
    coaching_feedback: CoachingFeedback[]
    created_at: string
    updated_at: string
}

export type Verdict = {
    pass: number
    fail: number
    borderline: number
}

export type EmotionRegulation = {
    pass: number
    fair: number
    poor: number
}

export type OpenRate = {
    pass: number
    fair: number
    poor: number
}

export type A3Score = {
    score: number 
    frequency: number 
}
