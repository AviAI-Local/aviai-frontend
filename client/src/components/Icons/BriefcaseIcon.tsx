import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function BriefcaseIcon({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            <path
                d='M12.6667 2.66666H3.33333C2.22867 2.66666 1.33333 3.562 1.33333 4.66666V8C1.33333 9.10466 2.22867 10 3.33333 10H12.6667C13.7713 10 14.6667 9.10466 14.6667 8V4.66666C14.6667 3.562 13.7713 2.66666 12.6667 2.66666Z'
                fill={accentColor}
            />
            <path
                d='M8 8.33334C8.55228 8.33334 9 7.88562 9 7.33334C9 6.78105 8.55228 6.33334 8 6.33334C7.44772 6.33334 7 6.78105 7 7.33334C7 7.88562 7.44772 8.33334 8 8.33334Z'
                fill={baseColor}
            />
            <path
                d='M12.6667 10H3.33333C2.22867 10 1.33333 9.10467 1.33333 8V12C1.33333 13.1047 2.22867 14 3.33333 14H12.6667C13.7713 14 14.6667 13.1047 14.6667 12V8C14.6667 9.10467 13.7713 10 12.6667 10Z'
                fill={baseColor}
            />
            <path
                d='M8.66667 1.33333C8.42267 1.33333 7.57733 1.33333 7.33333 1.33333C6.59667 1.33333 6 1.93 6 2.66667H10C10 1.93 9.40333 1.33333 8.66667 1.33333Z'
                fill={baseColor}
            />
        </SvgIcon>
    )
}

export default BriefcaseIcon
