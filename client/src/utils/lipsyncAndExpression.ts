import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const VISEME_MAP = {
    A: ['Jaw_Open', 'Mouth_Open', 'Mouth_Ape_Shape', , 'Tongue_Down', 'V_Open'],
    B: ['Mouth_Press_L', 'Mouth_Press_R', 'Jaw_Close'],
    C: [
        'Mouth_Funnel',
        'Mouth_Funnel_Down_L',
        'Mouth_Funnel_Down_R',
        'V_Tight_O',
        'Mouth_Tighten_L',
        'Mouth_Tighten_R',
        'Jaw_Open'
    ],
    D: ['Mouth_Funnel_Up_L', 'Mouth_Funnel_Up_R', 'Tongue_Up', 'Jaw_Open'],
    E: ['Mouth_Stretch_L', 'Mouth_Stretch_R', 'Mouth_Smile_L', 'Mouth_Smile_R', 'V_Wide'],
    F: ['V_Dental_Lip', 'Mouth_Bite', 'Mouth_Pucker_Up_L', 'Mouth_Pucker_Up_R', 'LowerLip_Down'],
    G: ['Mouth_Blow_L', 'Mouth_Blow_R', 'Jaw_Forward', 'Tongue_Down', 'V_Tight_O'],
    H: ['V_Affricate', 'Mouth_Funnel_Up_L', 'Mouth_Funnel_Up_R'],
    X: ['Jaw_Soft', 'Mouth_Relaxed']
}

export const EXPRESSIONS = {
    default: {
        Brow_Raise_Inner_L: 0.8,
        Brow_Raise_Inner_R: 0.8,
        Brow_Drop_L: 0.8,
        Brow_Drop_R: 0.8,
        Eye_Squint_L: 0.2,
        Eye_Squint_R: 0.2,
        Cheek_Raise_L: 0.2,
        Cheek_Raise_R: 0.2,
        Mouth_Frown_L: 0.3,
        Mouth_Frown_R: 0.3,
        Mouth_Down: 0.2
    },
    happy: {
        Brow_Raise_Inner_L: 0.2,
        Brow_Raise_Inner_R: 0.2,
        Brow_Raise_Outer_L: 0.3,
        Brow_Raise_Outer_R: 0.3,
        Eye_Squint_L: 0.2,
        Eye_Squint_R: 0.2,
        Eye_Wide_L: 0.1,
        Eye_Wide_R: 0.1,
        Cheek_Raise_L: 0.7,
        Cheek_Raise_R: 0.7,
        Mouth_Smile_L: 1,
        Mouth_Smile_R: 1,
        Mouth_Dimple_L: 0.2,
        Mouth_Dimple_R: 0.2
    },
    sad: {
        Brow_Raise_Inner_L: 0.8,
        Brow_Raise_Inner_R: 0.8,
        Brow_Drop_L: 0.8,
        Brow_Drop_R: 0.8,
        Eye_Squint_L: 0.2,
        Eye_Squint_R: 0.2,
        Cheek_Raise_L: 0.2,
        Cheek_Raise_R: 0.2,
        Mouth_Frown_L: 0.3,
        Mouth_Frown_R: 0.3,
        Mouth_Down: 0.2
    },
    angry: {
        Brow_Drop_L: 0.6,
        Brow_Drop_R: 0.6,
        Eye_Blink_L: 0.2,
        Eye_Blink_R: 0.2,
        Eye_Squint_L: 0.2,
        Eye_Squint_R: 0.2,
        Nose_Sneer_L: 0.4,
        Nose_Sneer_R: 0.4,
        Cheek_Raise_L: 0.5,
        Cheek_Raise_R: 0.5,
        Mouth_Up: 0.3
    },
    disgust: {
        Ear_Up_L: 0.12,
        Ear_Up_R: 0.12,
        Nose_Sneer_L: 1,
        Nose_Sneer_R: 1,
        Nose_Nostril_Down_L: 0.4,
        Nose_Nostril_Down_R: 0.4,
        Cheek_Raise_L: 0.8,
        Cheek_Raise_R: 0.8,
        Mouth_Frown_L: 0.22,
        Mouth_Frown_R: 0.22,
        Mouth_Chin_Up: 0.34,
        Jaw_Up: 0.32
    },
    fear: {
        Brow_Raise_Inner_L: 0.8,
        Brow_Raise_Inner_R: 0.8,
        Eye_Wide_L: 0.7,
        Eye_Wide_R: 0.7,
        Nose_Nostril_Down_L: 0.2,
        Nose_Nostril_Down_R: 0.2,
        Mouth_Frown_L: 0.4,
        Mouth_Frown_R: 0.4,
        Mouth_Tighten_L: 0.4,
        Mouth_Tighten_R: 0.4
    },
    suprised: {
        Brow_Raise_Inner_L: 1,
        Brow_Raise_Inner_R: 1,
        Brow_Raise_Outer_L: 1,
        Brow_Raise_Outer_R: 1,
        Eye_Squint_L: 0.3,
        Eye_Squint_R: 0.3,
        Eye_Wide_L: 1,
        Eye_Wide_R: 1,
        Mouth_Pucker_Up_L: 0.62,
        Mouth_Pucker_Up_R: 0.62,
        Mouth_Pucker_Down_L: 0.62,
        Mouth_Pucker_Down_R: 0.62,
        Mouth_Up: 0.58
    }
}

export function useFacialAnimation(group: React.RefObject<THREE.Group>, isTalking: boolean, expressionName: String) {
    const timeRef = useRef(0)
    const isTalkingRef = useRef(isTalking)
    const expressionWeight = useRef(1) // can animate in/out if needed

    // Sync prop with ref
    useEffect(() => {
        isTalkingRef.current = isTalking
    }, [isTalking])

    useFrame((_, delta) => {
        if (!group?.current) return

        const t = isTalking ? (timeRef.current += delta) : 0
        const visemeKeys = ['A', 'C', 'D']
        const visemeIndex = Math.floor(t * 2) % visemeKeys.length
        const currentViseme = isTalking ? visemeKeys[visemeIndex] : null
        const visemeMorphs = currentViseme ? VISEME_MAP[currentViseme] || [] : []
        const expressionMorphs = EXPRESSIONS[expressionName] || {}

        group.current.traverse((child) => {
            if (!child.isSkinnedMesh || !child.morphTargetDictionary || !child.morphTargetInfluences) return

            const dict = child.morphTargetDictionary
            const influences = child.morphTargetInfluences

            const jaw = group.current.getObjectByName('Jaw')
            const lowerTeeth = group.current.getObjectByName('Teeth_Lower')

            for (const [name, index] of Object.entries(dict)) {
                // Viseme animation
                let visemeValue = 0
                if (isTalking && visemeMorphs.includes(name)) {
                    const idx = visemeMorphs.indexOf(name)
                    const freq = 2 + idx * 0.6
                    const amp = 0.25 + idx * 0.05
                    visemeValue = Math.abs(Math.sin(freq * t)) * amp
                }

                // Expression morph (non-mouth applies fully, mouth applies partially)
                const expVal = expressionMorphs[name] ?? 0
                const isMouth = name.includes('Mouth')
                const expressionValue = isMouth ? expVal * 0.3 : expVal

                // Final weight (clamped blend)
                const target = Math.min(visemeValue + expressionValue, 1)
                influences[index] = THREE.MathUtils.lerp(influences[index], target, 0.2)
            }

            // Jaw + Teeth Sync (based on viseme power)
            const jawOpen = visemeMorphs.some((key) => key.includes('A')) ? 1 : 0
            if (jaw) jaw.rotation.x = -THREE.MathUtils.degToRad(jawOpen * 15)
            if (lowerTeeth) lowerTeeth.position.y = -0.01 * jawOpen
        })
    })
}

export function useEyeControllerWithMorphs(groupRef: React.RefObject<THREE.Group>) {
    const dartTimer = useRef(0)
    const blinkTimer = useRef(0)
    const blinkStrength = useRef(0)
    const activeLook = useRef<null | string[]>(null)
    const lookStrength = useRef(0)

    const LOOK_DIRECTIONS = [
        ['Eye_L_Look_L', 'Eye_R_Look_L'],
        ['Eye_L_Look_R', 'Eye_R_Look_R'],
        ['Eye_L_Look_Up', 'Eye_R_Look_Up'],
        ['Eye_L_Look_Down', 'Eye_R_Look_Down']
    ]

    useFrame((_, delta) => {
        if (!groupRef.current) return

        // ===== Eye Darting =====
        dartTimer.current -= delta
        if (dartTimer.current <= 0) {
            activeLook.current = LOOK_DIRECTIONS[Math.floor(Math.random() * LOOK_DIRECTIONS.length)]
            lookStrength.current = 1
            dartTimer.current = 1.5 + Math.random() * 2.5
        }

        lookStrength.current = THREE.MathUtils.lerp(lookStrength.current, 0, 0.03)

        // ===== Blinking =====
        blinkTimer.current -= delta
        if (blinkTimer.current <= 0) {
            blinkStrength.current = 1
            blinkTimer.current = 3 + Math.random() * 3
        }

        if (blinkStrength.current > 0) {
            blinkStrength.current -= delta * 5
            blinkStrength.current = Math.max(blinkStrength.current, 0)
        }

        // ===== Apply to Morphs =====
        groupRef.current.traverse((child) => {
            if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
                const dict = child.morphTargetDictionary
                const influences = child.morphTargetInfluences

                // Blink
                if ('Eye_Blink_L' in dict) {
                    influences[dict['Eye_Blink_L']] = THREE.MathUtils.lerp(
                        influences[dict['Eye_Blink_L']],
                        blinkStrength.current,
                        0.4
                    )
                }
                if ('Eye_Blink_R' in dict) {
                    influences[dict['Eye_Blink_R']] = THREE.MathUtils.lerp(
                        influences[dict['Eye_Blink_R']],
                        blinkStrength.current,
                        0.4
                    )
                }

                // Eye direction
                for (const dirList of LOOK_DIRECTIONS) {
                    for (const name of dirList) {
                        const index = dict[name]
                        if (index !== undefined) {
                            const target =
                                activeLook.current?.includes(name) && lookStrength.current > 0
                                    ? lookStrength.current
                                    : 0
                            influences[index] = THREE.MathUtils.lerp(influences[index], target, 0.2)
                        }
                    }
                }
            }
        })
    })
}
