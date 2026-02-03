import { serverAPI } from "./axios"

export async function fetchStats(userId: string, statType: string) {
    const response = await serverAPI.get('/agents/performance-analysis/statistics', {
      params: {
        userId,
        stat_type: statType,
      },
    })
    return response.data
  }
