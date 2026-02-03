import { Box } from "@mui/material"
import PreviousNextButton from "../UseCase/PreviousNextButton"
import type { ReactNode } from "react";

type BoardLayoutProps = {
  children: ReactNode;
};

function BoardLayout({children}: BoardLayoutProps) {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.contrastText',
                width: '100%',
                marginX: 3,
                borderTopLeftRadius: 30,
                position: 'relative',
                display: 'flex',
                gap: 2,
                flex: 1,
                overflow: 'auto'
            }}
        >
            <Box
                sx={{
                    overflow: 'auto',
                    paddingBottom: 8 ,
                    width: '100%'
                }}
            >
                {children}
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 110,
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}
            >
                {/* <PreviousNextButton /> */}
            </Box>
        </Box>
    )
}

export default BoardLayout
