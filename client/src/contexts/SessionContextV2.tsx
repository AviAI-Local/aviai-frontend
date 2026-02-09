import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";
import RecordRTC from "recordrtc";
import { uploadVideo } from "../api/session";
import { useSession as useSessionV1 } from '../contexts/SessionContext'

const API_BASE_URL = "http://localhost:8000";
const WS_BASE_URL = "ws://localhost:8000";
const TTS_SAMPLE_RATE = 24000;
const MIC_SAMPLE_RATE = 16000;

type SessionStatus = "idle" | "connecting" | "listening" | "speaking" | "disconnected" | "error";

type SessionContextV2Type = {
  sessionId: string | null;
  status: SessionStatus;
  connected: boolean;
  isSpeaking: boolean;
  isPlayingAudio: boolean;
  isRecording: boolean;
  latestResponse: string;
  userQuery: string;
  voiceInstructions: string;
  avatarInstructions: string;
  error: string | null;
  connectConversation: (sessionIdToConnect?: string) => Promise<void>;
  toggleSpeaking: () => void;
  sendMessage: (text: string) => void;
  disconnect: () => void;
  resetSession: () => void;
  startScreenRecording: () => Promise<void>;
  stopScreenRecording: () => Promise<File | null>;
  toggleScreenRecording: () => Promise<void>;
};

type SessionProviderV2Props = {
  children: ReactNode;
};

// Audio conversion utilities
const pcm16ToFloat32 = (pcm16Array: Int16Array): Float32Array => {
  const float32 = new Float32Array(pcm16Array.length);
  for (let i = 0; i < pcm16Array.length; i++) {
    float32[i] = pcm16Array[i] / 32768;
  }
  return float32;
};

const float32ToPcm16 = (float32Array: Float32Array): Int16Array => {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
};

const SessionContextV2 = createContext<SessionContextV2Type | null>(null);

export const SessionProviderV2 = ({ children }: SessionProviderV2Props) => {
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [connected, setConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [latestResponse, setLatestResponse] = useState("");
  const [userQuery, setUserQuery] = useState("")
  const [voiceInstructions, setVoiceInstructions] = useState("neutral");
  const [avatarInstructions, setAvatarInstructions] = useState("neutral");
  const [error, setError] = useState<string | null>(null);

  const { session } = useSessionV1()


  // Refs for WebSocket and audio
  const conversationWsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const speakingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Send JSON message via WebSocket
  const sendJson = useCallback((message: unknown) => {
    if (conversationWsRef.current?.readyState === WebSocket.OPEN) {
      conversationWsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Initialize audio output
  const initAudioOutput = useCallback(async () => {
    audioCtxRef.current = new AudioContext({ sampleRate: TTS_SAMPLE_RATE });
    await audioCtxRef.current.resume();
  }, []);

  // Play TTS audio
  const playAudio = useCallback((audioData: ArrayBuffer, onComplete: () => void) => {
    const pcm16 = new Int16Array(audioData);
    const float32 = pcm16ToFloat32(pcm16);
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const buffer = ctx.createBuffer(1, float32.length, TTS_SAMPLE_RATE);
    buffer.copyToChannel(float32 as Float32Array<ArrayBuffer>, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    setIsPlayingAudio(true);
    source.onended = () => {
      setIsPlayingAudio(false);
      onComplete();
    };
    source.start();
  }, []);

  // Initialize microphone
  const initMicrophone = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    micCtxRef.current = new AudioContext({ sampleRate: MIC_SAMPLE_RATE });
    await micCtxRef.current.resume();
    return stream;
  }, []);

  // Setup audio processor
  const setupProcessor = useCallback((stream: MediaStream, onAudioData: (buffer: ArrayBuffer) => void) => {
    if (!micCtxRef.current) return;
    const src = micCtxRef.current.createMediaStreamSource(stream);
    processorRef.current = micCtxRef.current.createScriptProcessor(4096, 1, 1);
    src.connect(processorRef.current);
    processorRef.current.connect(micCtxRef.current.destination);
    processorRef.current.onaudioprocess = (e: AudioProcessingEvent) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = float32ToPcm16(input as Float32Array);
      onAudioData(pcm16.buffer as ArrayBuffer);
    };
  }, []);

  // Handle mic audio data
  const handleMicAudioData = useCallback((audioBuffer: ArrayBuffer) => {
    if (!speakingRef.current) return;
    if (!conversationWsRef.current || conversationWsRef.current.readyState !== WebSocket.OPEN) return;
    conversationWsRef.current.send(audioBuffer);
  }, []);

  // Handle conversation messages from WebSocket
  const handleConversationMessage = useCallback((event: MessageEvent) => {
    if (typeof event.data === "string") {
      const msg = JSON.parse(event.data);
      if (msg.type === "assistant_text") {
        setLatestResponse(msg.content);
        setVoiceInstructions(msg.voice_instructions || "neutral");
        setAvatarInstructions(msg.avatar_instructions || "neutral");
      }
      if (msg.type === "status") {
        setStatus(msg.state);
      }
      if (msg.type === "user_query") {
        setUserQuery(msg.query)
      }
      return;
    }
    // Binary audio data
    playAudio(event.data, () => {
      sendJson({ type: "audio_playback_complete" });
    });
  }, [playAudio, sendJson]);

  // Connect to conversation WebSocket
  const connectConversation = useCallback(async (sessionIdToConnect?: string): Promise<void> => {
    const id = sessionIdToConnect || sessionId;
    if (!id) {
      throw new Error("No session ID provided");
    }

    setStatus("connecting");

    try {
      await initAudioOutput();

      conversationWsRef.current = new WebSocket(
        `${WS_BASE_URL}/api/v1/session/${id}/conversation`
      );
      conversationWsRef.current.binaryType = "arraybuffer";

      conversationWsRef.current.onopen = async () => {
        console.log("WebSocket connected for session:", id);
        const stream = await initMicrophone();
        setupProcessor(stream, handleMicAudioData);
        setConnected(true);
        setStatus("listening");
      };

      conversationWsRef.current.onmessage = handleConversationMessage;

      conversationWsRef.current.onclose = () => {
        console.log("WebSocket closed");
        setConnected(false);
        setStatus("disconnected");
      };

      conversationWsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("error");
      };
    } catch (err) {
      console.error("Failed to connect:", err);
      setStatus("error");
      throw err;
    }
  }, [sessionId, initAudioOutput, initMicrophone, setupProcessor, handleMicAudioData, handleConversationMessage]);

  // Toggle speaking (push-to-talk)
  const toggleSpeaking = useCallback(() => {
    if (!connected) return;
    const next = !speakingRef.current;
    speakingRef.current = next;
    setIsSpeaking(next);
    if (!next) {
      sendJson({ type: "end_of_utterance" });
    }
  }, [connected, sendJson]);

  const sendMessage = useCallback((text: string) => {
    if (!connected || !text.trim()) return;
    sendJson({ type: "text_message", text: text.trim() });
  }, [connected, sendJson]);

  // Disconnect and cleanup
  const disconnect = useCallback(() => {
    // Close WebSocket
    conversationWsRef.current?.close();
    conversationWsRef.current = null;

    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Disconnect audio processor
    processorRef.current?.disconnect();
    processorRef.current = null;

    // Close audio contexts
    micCtxRef.current?.close();
    micCtxRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    // Reset state
    setConnected(false);
    setIsSpeaking(false);
    speakingRef.current = false;
    setStatus("disconnected");
    setLatestResponse("");
  }, []);

  // Reset session (for creating a new one)
  const resetSession = useCallback(() => {
    disconnect();
    setSessionId(null);
    setStatus("idle");
    setError(null);
  }, [disconnect]);


  const recorderRef = useRef<RecordRTC | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Ref to hold AudioContext for cleanup
  const recordingAudioCtxRef = useRef<AudioContext | null>(null)

  // Start screen recording with microphone
  const startScreenRecording = useCallback(async () => {
    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Get microphone stream
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      // Use AudioContext to mix screen audio and mic audio
      const audioContext = new AudioContext()
      recordingAudioCtxRef.current = audioContext
      const destination = audioContext.createMediaStreamDestination()

      // Connect microphone to destination
      const micSource = audioContext.createMediaStreamSource(micStream)
      micSource.connect(destination)

      // Connect screen audio to destination (if available)
      const screenAudioTracks = screenStream.getAudioTracks()
      if (screenAudioTracks.length > 0) {
        const screenAudioStream = new MediaStream(screenAudioTracks)
        const screenSource = audioContext.createMediaStreamSource(screenAudioStream)
        screenSource.connect(destination)
      }

      // Combine video from screen + mixed audio from AudioContext
      const combinedStream = new MediaStream()
      screenStream.getVideoTracks().forEach((track) => {
        combinedStream.addTrack(track)
      })
      destination.stream.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track)
      })

      screenStreamRef.current = combinedStream

      // Create recorder
      recorderRef.current = new RecordRTC(combinedStream, {
        type: 'video',
        mimeType: 'video/webm',
        disableLogs: true
      })

      recorderRef.current.startRecording()
      setIsRecording(true)

      // Handle when user stops screen share via browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenRecording()
      }
    } catch (err) {
      console.error('Failed to start screen recording:', err)
      throw err
    }
  }, [])

  // Stop screen recording and upload
  const stopScreenRecording = useCallback(async (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!recorderRef.current) {
        resolve(null)
        return
      }

      recorderRef.current.stopRecording(async () => {
        const blob = recorderRef.current?.getBlob()

        // Stop all tracks
        screenStreamRef.current?.getTracks().forEach(track => track.stop())
        screenStreamRef.current = null
        recorderRef.current = null

        // Close AudioContext
        recordingAudioCtxRef.current?.close()
        recordingAudioCtxRef.current = null

        setIsRecording(false)

        console.log("stop")
        console.log("session: ", session?.id)

        if (blob) {
          console.log("blob")
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: 'video/webm'
          })

          // Upload recording
          if (session?.id) {
            try {
              await uploadVideo(session?.id, file)
            } catch (err) {
              console.error('Failed to upload recording:', err)
            }
          }

          resolve(file)
        } else {
          resolve(null)
        }
      })
    })
  }, [sessionId])

  // Toggle screen recording
  const toggleScreenRecording = useCallback(async () => {
    if (isRecording) {
      await stopScreenRecording()
    } else {
      await startScreenRecording()
    }
  }, [isRecording, startScreenRecording, stopScreenRecording])



  const value = {
    // State
    sessionId,
    status,
    connected,
    isSpeaking,
    isPlayingAudio,
    isRecording,
    latestResponse,
    voiceInstructions,
    avatarInstructions,
    error,
    userQuery,
    // Actions
    connectConversation,
    toggleSpeaking,
    disconnect,
    resetSession,
    sendMessage,
    startScreenRecording,
    stopScreenRecording,
    toggleScreenRecording
  };

  return (
    <SessionContextV2.Provider value={value}>
      {children}
    </SessionContextV2.Provider>
  );
}

export const useSession = (): SessionContextV2Type => {
  const context = useContext(SessionContextV2);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
