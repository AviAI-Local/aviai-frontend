import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function BackIcon({ baseColor = '#3D64FD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            <svg width='32' height='24' viewBox='0 0 32 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M1.75 8.24984H23.125C27.0601 8.24984 30.25 11.4398 30.25 15.3748C30.25 19.3099 27.0601 22.4998 23.125 22.4998H16M1.75 8.24984L8.08333 1.9165M1.75 8.24984L8.08333 14.5832'
                    stroke={baseColor}
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </SvgIcon>
    )
}

export default BackIcon
