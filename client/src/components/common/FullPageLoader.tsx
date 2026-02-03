import { Backdrop, CircularProgress } from '@mui/material'

function FullPageLoader({ loading }: { loading: boolean }) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={loading}
        >
            <CircularProgress color='primary' />
        </Backdrop>
    )
}

export default FullPageLoader
