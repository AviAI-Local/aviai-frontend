import type { Session } from '../types/session'
import { mapSessions } from '../utils/mapping'
import { serverAPI } from './axios'

export const createNewSession = async (scenarioId: string, accountId: string) => {
    const res = await serverAPI.post(`/session/create`, {
        scenario_id: scenarioId,
        account_id: accountId
    })

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export const uploadRecording = async (sessionID: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionID)

    const res = await serverAPI.post('/recording/upload-audio', formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }

}

export const uploadVideo = async (sessionID: string, file: File) => {
    console.log('Uploading video:', { sessionID, fileName: file.name, fileSize: file.size, fileType: file.type })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('session_id', sessionID)

    const res = await serverAPI.post('/recording/upload-video', formData)

    if (res.status === 200) {
        return res.data
    }
    throw new Error(`Upload failed with status ${res.status}`)
}

export const getUserSessions = async () => {
    try {
        const res = await serverAPI.get(`/session`)

        if (res.status === 200 && Array.isArray(res.data)) {
            return mapSessions(res.data)
        }

        return []
    } catch (err) {
        console.error('Error fetching sessions', err)
        return []
    }
}

// export const getUserHistory = async () => {
//     try {
//         const res = await serverAPI.get(`/conversation/`)
//         if (res.status === 200 && Array.isArray(res.data)) {
//             return mapSessions(res.data)
//         }

//         return []
//     } catch (err) {
//         console.error('Error fetching sessions', err)
//         return []
//     }
// }

export const getConversationPDF = async (id: string) => {
    try {
        const res = await serverAPI.get(`conversation/convert-to-pdf/${id}`)
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        throw err
    }
}

export const getEmotionAnalysis = async (id: string) => {
    try {
        const res = await serverAPI.post(`analysis/analyze-by-id/${id}`)
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        throw err
    }
}

export const getPerformanceAnalysis = async (conversationId: string, userId: string) => {
    console.log(conversationId, userId)
   
    try { 
        const res = await serverAPI.post(`performance-analysis/pdf?conversation_id=${conversationId}&user_id=${userId}&model=gpt-4o-mini`)
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        throw err
    }
}

// export const getPerformanceAnalysis = async (conversationId: string, userId: string) => {
//     if (!conversationId || !userId) throw new Error('Missing IDs');
//     const base = '/agents/performance-analysis/pdf';
//     const url = `${base}?conversation_id=${encodeURIComponent(conversationId)}&user_id=${encodeURIComponent(userId)}`;
  
//     const res = await serverAPI.post(url, undefined, {
//       headers: { Accept: 'application/json' }, // or application/pdf if streaming
//       validateStatus: s => s < 500,            // surface 4xx to code instead of throwing
//     });
  
//     console.log('Requested URL:', res?.request?.responseURL);
//     if (res.status !== 200) {
//       // Log exact FastAPI validation message to console
//       console.error('Server error payload:', res.data);
//       throw new Error(`Request failed ${res.status}`);
//     }
//     return res.data;
//   };