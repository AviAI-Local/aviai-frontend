import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function LogoutIcon({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16' fill='yellow'>
            {/* Inner fill background */}
            <rect x='3' y='3' width='9' height='11' fill={accentColor} />

            {/* Outer border */}
            <rect x='2' y='2' width='11' height='13' rx='2' stroke={baseColor} fill={accentColor} strokeWidth='2' />

            {/* Arrow path */}
            <path
                d='M4.19261 8.92656L6.28579 10.8453C6.39489 10.9437 6.54148 11 6.69489 11C7.01364 11 7.27273 10.7625 7.27273 10.4703L7.27273 9.5L9.45455 9.5C9.75625 9.5 10 9.27656 10 9V8C10 7.72344 9.75625 7.5 9.45455 7.5L7.27273 7.5L7.27273 6.52969C7.27273 6.2375 7.01364 6 6.69489 6C6.54148 6 6.39489 6.05469 6.2858 6.15469L4.19261 8.07344C4.06989 8.18594 4 8.34062 4 8.5C4 8.65937 4.06989 8.81406 4.19261 8.92656Z'
                fill={baseColor}
            />

            {/* Right panel */}
            <rect x='9' y='3' width='3' height='11' fill={baseColor} />
        </SvgIcon>
    )
}

export default LogoutIcon
