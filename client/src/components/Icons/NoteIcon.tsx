import { SvgIcon } from "@mui/material"
import type { CustomIconProps } from "./types"


function NoteIcon({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) {
    return (
        <SvgIcon {...props} viewBox='0 0 16 16'>
            {/* Book Shape */}
            <path
                d='M12 14H4C2.89533 14 2 13.1047 2 12V2.66667C2 2.29867 2.29867 2 2.66667 2H13.3333C13.7013 2 14 2.29867 14 2.66667V12C14 13.1047 13.1047 14 12 14Z'
                fill={baseColor}
            />
            {/* Inner line (title bar or page) */}
            <path
                d='M9.33333 5.33333H6.66667C6.29867 5.33333 6 5.03467 6 4.66667C6 4.29867 6.29867 4 6.66667 4H9.33333C9.70133 4 10 4.29867 10 4.66667C10 5.03467 9.70133 5.33333 9.33333 5.33333Z'
                fill={accentColor}
            />
        </SvgIcon>
    )
}

export default NoteIcon
