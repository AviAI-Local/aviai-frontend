import { SvgIcon } from '@mui/material'
import type { CustomIconProps } from './types'

function RecordIcon({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M11.971 21.6663C17.3097 21.6663 21.6377 17.3384 21.6377 11.9997C21.6377 6.66092 17.3097 2.33301 11.971 2.33301C6.63224 2.33301 2.30432 6.66092 2.30432 11.9997C2.30432 17.3384 6.63224 21.6663 11.971 21.6663Z'
                    stroke={baseColor}
                    stroke-width='2.25'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
                <path
                    d='M12.0001 16.0891C14.2584 16.0891 16.0891 14.2584 16.0891 12.0001C16.0891 9.74184 14.2584 7.91113 12.0001 7.91113C9.74184 7.91113 7.91113 9.74184 7.91113 12.0001C7.91113 14.2584 9.74184 16.0891 12.0001 16.0891Z'
                    stroke={baseColor}
                    stroke-width='2.25'
                    stroke-miterlimit='10'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
                <circle cx='12' cy='12' r='4' fill={baseColor} fill-opacity='0.6' />
            </svg>
        </SvgIcon>
    )
}

export default RecordIcon
