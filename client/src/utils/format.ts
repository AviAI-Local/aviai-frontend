export function formatDate(dateString: string | undefined): string {
    if (!dateString) return ''
    const date = new Date(dateString.split('.')[0]) // remove microseconds if present

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }

    return date.toLocaleDateString('en-US', options)
}

export function formatTimeToHHMM(dateString: string | undefined): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12

    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

export function capitalize(word: string): string {
    if (!word) return ''
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const tagStyles = {
    red: {
        color: '#F25D5A',
        backgroundColor: '#FFD0D8'
    },
    blue: {
        color: '#3D64FD',
        backgroundColor: '#D6E0FF'
    },
    green: {
        color: '#289654',
        backgroundColor: '#DCF2E5'
    },
    yellow: {
        color: '#E5C219',
        backgroundColor: '#FFF9E6'
    }
}

const colorTags = ['red', 'blue', 'green', 'yellow'] as const

export function getColorForChip(industry: string | null | undefined) {
    const safeIndustry = industry ?? ''
    const index = safeIndustry.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorTags.length
    return tagStyles[colorTags[index]]
}
