import { type ReactNode, createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { MeetingContextType } from '../types/meeting'
import { useConfig } from './ConfigContext'
import { uploadRecording, uploadVideo } from '../api/session'
import { useLoading } from './LoadingContext'
import RecordRTC from 'recordrtc'
import { useSession } from './SessionContextV2'

const MeetingContext = createContext<MeetingContextType | undefined>(undefined)

let mediaRecorder: MediaRecorder | null = null
let recordedChunks: Blob[] = []

function MeetingProvider({ children }: { children: ReactNode }) {
    const { config } = useConfig()
    const { setLoading } = useLoading()

    // Use WebSocket-based session for mic control
    const { toggleSpeaking } = useSession()

    const [showChat, setShowChat] = useState(false)
    const [showNote, setShowNote] = useState(false)
    const [showTranscript, setShowTranscript] = useState(false)
    const [micEnabled, setMicEnabled] = useState(config.settings.inputs.mic)
    const [cameraEnabled, setCameraEnabled] = useState(config.settings.inputs.camera)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isRecord, setIsRecord] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [option, setOption] = useState<string | null>(null)

    const toggleChat = useCallback(() => {
        setShowChat((prev) => {
            const newValue = !prev
            if (newValue) {
                setShowTranscript(false)
                setShowNote(false)
            }
            return newValue
        })
    }, [])

    const toggleNote = useCallback(() => {
        setShowNote((prev) => {
            const newValue = !prev
            if (newValue) {
                setShowTranscript(false)
                setShowChat(false)
            }
            return newValue
        })
    }, [])

    const toggleTranscript = useCallback(() => {
        setShowTranscript((prev) => {
            const newValue = !prev
            if (newValue) {
                setShowChat(false)
                setShowNote(false)
            }
            return newValue
        })
    }, [])

    // Toggle microphone using WebSocket-based push-to-talk
    const toggleMic = useCallback(() => {
        toggleSpeaking()
        setMicEnabled(!micEnabled)
    }, [micEnabled, toggleSpeaking])

    // Toggle camera (local state only, no LiveKit)
    const toggleCamera = useCallback(() => {
        setCameraEnabled(!cameraEnabled)
    }, [cameraEnabled])

    const recorderRef = useRef<RecordRTC | null>(null)
    const [recording, setRecording] = useState(false)

    // let mediaRecorder: MediaRecorder | null = null
    // let recordedChunks: Blob[] = []

    // let mediaRecorder: MediaRecorder | null = null
    // let recordedChunks: Blob[] = []

    const startVideoRecording = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true // Try to get system audio (may not be supported)
            })

            const micStream = await navigator.mediaDevices.getUserMedia({
                // audio: {
                //     echoCancellation: true,
                //     noiseSuppression: true
                // }
                audio: true
            })

            const audioContext = new AudioContext()
            const destination = audioContext.createMediaStreamDestination()

            // Mic
            const micSource = audioContext.createMediaStreamSource(micStream)
            micSource.connect(destination)

            // Optional: Try to get tab/system audio from screen stream
            const screenAudioTracks = screenStream.getAudioTracks()
            if (screenAudioTracks.length > 0) {
                const screenAudioStream = new MediaStream(screenAudioTracks)
                const screenSource = audioContext.createMediaStreamSource(screenAudioStream)
                screenSource.connect(destination)
            } else {
                console.warn('⚠️ No audio from screen stream')
            }

            const combinedStream = new MediaStream()

            screenStream.getVideoTracks().forEach((track) => {
                combinedStream.addTrack(track)
            })

            destination.stream.getAudioTracks().forEach((track) => {
                combinedStream.addTrack(track)
            })

            recordedChunks = []

            mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm; codecs=vp9,opus'
            })

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data)
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' })
                if (blob) {
                    const file = new File([blob], 'video.webm', { type: blob.type })

                    // ✅ Trigger upload asynchronously, outside the sync callback
                    uploadVideo(config.settings.roomName, file)
                        .then(() => console.log('✅ Upload complete'))
                        .catch((err) => console.error('❌ Upload failed:', err))
                }

                setRecording(true)
                setIsRecord(false)
                console.log('🛑 Recording stopped')
                if (screenStream) {
                    screenStream.getTracks().forEach((track) => track.stop()) // 🛑 Stops screen sharing
                }
            }

            mediaRecorder.start()
            console.log('🎥 Recording started')
        } catch (err) {
            console.error('❌ Failed to start recording:', err)
        }
    }

    const stopVideoRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop()
            console.log('🛑 Recording stopped')
        } else {
            console.warn('⚠️ No active recording')
        }
    }

    // const startVideoRecording = async () => {
    //     const canvas = document.querySelector('canvas') as HTMLCanvasElement
    //     if (!canvas) {
    //         console.error('❌ Canvas not found!')
    //         return
    //     }

    //     const videoStream = canvas.captureStream(30)

    //     const audioContext = new AudioContext()
    //     const destination = audioContext.createMediaStreamDestination()

    //     // 🎤 Microphone
    //     let micStream: MediaStream
    //     try {
    //         micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    //     } catch (err) {
    //         console.error('❌ Mic error:', err)
    //         return
    //     }

    //     const micSource = audioContext.createMediaStreamSource(micStream)
    //     micSource.connect(destination)

    //     // 🔊 Remote audio (LiveKit)
    //     tracks.forEach(({ participant, publication }) => {
    //         const isRemote = !participant.isLocal
    //         const audioTrack = publication.audioTrack
    //         if (isRemote && audioTrack && !audioTrack.isMuted) {
    //             const remoteStream = new MediaStream([audioTrack.mediaStreamTrack])
    //             const remoteSource = audioContext.createMediaStreamSource(remoteStream)
    //             remoteSource.connect(destination)
    //         }
    //     })

    //     const combinedStream = new MediaStream([
    //         ...videoStream.getVideoTracks(),
    //         ...destination.stream.getAudioTracks()
    //     ])

    //     recordedChunks = []

    //     mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' })

    //     mediaRecorder.ondataavailable = (e) => {
    //         if (e.data.size > 0) recordedChunks.push(e.data)
    //     }

    //     mediaRecorder.onstop = () => {
    //         const blob = new Blob(recordedChunks, { type: 'video/webm' })
    //         if (blob) {
    //             const file = new File([blob], 'video.webm', { type: blob.type })

    //             // ✅ Trigger upload asynchronously, outside the sync callback
    //             uploadVideo(config.settings.roomName, file)
    //                 .then(() => console.log('✅ Upload complete'))
    //                 .catch((err) => console.error('❌ Upload failed:', err))
    //         }

    //         setRecording(true)
    //         setIsRecord(false)
    //         console.log('🛑 Recording stopped')
    //     }

    //     mediaRecorder.start()
    //     setIsRecord(true)
    //     console.log(mediaRecorder)
    //     console.log('✅ Recording started')
    // }

    // const stopVideoRecording = () => {
    //     if (!mediaRecorder) {
    //         console.warn('❌ No active mediaRecorder')
    //         return
    //     }

    //     if (mediaRecorder.state === 'inactive') {
    //         console.warn('⏹️ mediaRecorder already stopped')
    //         return
    //     }

    //     mediaRecorder.stop()
    //     setIsRecord(false)
    //     setRecording(true)
    //     console.log('🛑 Recording stopped')
    // }

    // const startAudioRecording = async () => {
    //     // Get microphone stream for recording
    //     let micStream: MediaStream
    //     try {
    //         micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    //     } catch (err) {
    //         console.error('❌ Could not access microphone:', err)
    //         return
    //     }

    //     if (micStream.getAudioTracks().length === 0) {
    //         console.error('❌ No audio tracks to record')
    //         return
    //     }

    //     const recorder = new RecordRTC(micStream, {
    //         type: 'audio',
    //         mimeType: 'audio/wav',
    //         recorderType: RecordRTC.StereoAudioRecorder,
    //         numberOfAudioChannels: 2
    //     })

    //     recorderRef.current = recorder
    //     recorder.startRecording()
    //     setIsRecord(true)
    //     console.log('✅ Recording started')
    // }

    // const stopAudioRecording = async () => {
    //     if (!recorderRef.current) return

    //     recorderRef.current.stopRecording(async () => {
    //         const blob = recorderRef.current?.getBlob()
    //         if (blob) {
    //             const file = new File([blob], 'audio.wav', { type: blob.type })

    //             // ✅ Trigger upload asynchronously, outside the sync callback
    //             uploadRecording(config.settings.roomName, file)
    //                 .then(() => console.log('✅ Upload complete'))
    //                 .catch((err) => console.error('❌ Upload failed:', err))
    //         }

    //         setRecording(true)
    //         setIsRecord(false)
    //         console.log('🛑 Recording stopped')
    //     })
    // }

    // const toggleRecordingVideo = async () => {
    //     const shouldStart = !isRecord

    //     if (shouldStart) {
    //         await startVideoRecording()
    //     } else {
    //         console.log('testing')
    //         stopVideoRecording()
    //     }

    //     setIsRecord(shouldStart)
    // }

    // const toggleRecordingAudio = async () => {
    //     const shouldStart = !isRecord

    //     if (shouldStart) {
    //         await startRecording()
    //     } else {
    //         await stopRecording()
    //     }

    //     setIsRecord(shouldStart)
    // }

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1)
        }, 1000)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const value = useMemo(
        () => ({
            showChat,
            toggleChat,
            showTranscript,
            showNote,
            toggleNote,
            toggleTranscript,
            micEnabled,
            toggleMic,
            cameraEnabled,
            toggleCamera,
            elapsedTime,
            isRecord,
            setIsRecord,
            // startAudioRecording,
            // stopAudioRecording,
            startVideoRecording,
            stopVideoRecording,
            recording, 
            option,
            setOption
        }),
        [
            showChat,
            toggleChat,
            micEnabled,
            toggleMic,
            cameraEnabled,
            toggleCamera,
            elapsedTime,
            showTranscript,
            // isRecord,
            // stopAudioRecording,
            startVideoRecording,
            stopVideoRecording,
            showNote,
            toggleNote,
            recording,
            option,
            setOption
        ]
    )

    return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
}

const useMeetingContext = () => {
    const context = useContext(MeetingContext)
    if (!context) {
        throw new Error('useMeetingContext must be used within a MeetingProvider')
    }
    return context
}

export { MeetingProvider, useMeetingContext }
