import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function TranscriptIcon({ baseColor = '#3D64FD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M3 10V14M7.5 11V13M12 6V18M16.5 3V21M21 10V14'
                    stroke={baseColor}
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
            </svg>
        </SvgIcon>
    )
}

export default TranscriptIcon
