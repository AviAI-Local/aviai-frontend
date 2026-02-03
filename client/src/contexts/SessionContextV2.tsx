import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";

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
  latestResponse: string;
  voiceInstructions: string;
  avatarInstructions: string;
  isLoading: boolean;
  error: string | null;
  connectConversation: (sessionIdToConnect?: string) => Promise<void>;
  toggleSpeaking: () => void;
  disconnect: () => void;
  resetSession: () => void;
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
  const [voiceInstructions, setVoiceInstructions] = useState("neutral");
  const [avatarInstructions, setAvatarInstructions] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      return;
    }
    // Binary audio data
    playAudio(event.data, () => {
      sendJson({ type: "audio_playback_complete" });
    });
  }, [playAudio, sendJson]);

  // Create a new session
//   const createSession = useCallback(async (scenarioId: string, accountId: string): Promise<string> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/session/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           scenario_id: scenarioId,
//           account_id: accountId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create session: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setSessionId(data.session_id);
//       setIsLoading(false);
//       return data.session_id;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       setIsLoading(false);
//       throw err;
//     }
//   }, []);

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

  const value = {
    // State
    sessionId,
    status,
    connected,
    isSpeaking,
    isPlayingAudio,
    latestResponse,
    voiceInstructions,
    avatarInstructions,
    isLoading,
    error,
    // Actions
    connectConversation,
    toggleSpeaking,
    disconnect,
    resetSession,
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
