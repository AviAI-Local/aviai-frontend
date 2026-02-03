import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function ProfileIcon({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            {/* Outer rectangle */}
            <path
                d='M2.66667 12.6667V3.33333C2.66667 2.22867 3.56201 1.33333 4.66667 1.33333H11.3333C12.438 1.33333 13.3333 2.22867 13.3333 3.33333V12.6667C13.3333 13.7713 12.438 14.6667 11.3333 14.6667H4.66667C3.56201 14.6667 2.66667 13.7713 2.66667 12.6667Z'
                fill={baseColor}
            />
            {/* Circular avatar */}
            <path
                d='M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z'
                fill={accentColor}
            />
            {/* Name placeholder */}
            <path
                d='M9.99999 9.33333H5.99999C5.26332 9.33333 4.66666 9.93 4.66666 10.6667C4.66666 11.4033 5.26332 12 5.99999 12H9.99999C10.7367 12 11.3333 11.4033 11.3333 10.6667C11.3333 9.93 10.7367 9.33333 9.99999 9.33333Z'
                fill={accentColor}
            />
        </SvgIcon>
    )
}

export default ProfileIcon
