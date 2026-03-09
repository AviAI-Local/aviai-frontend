import './App.css'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { theme } from './utils/theme'
import GlobalFonts from './components/common/GlobalFonts'
import { LoadingProvider } from './contexts/LoadingContext'
import { UseCasesProvider } from './contexts/UseCasesContext'
import { SessionProvider } from './contexts/SessionContext'
import { UserProvider } from './contexts/UserContext'
import { routes } from './routes'
import { NotificationProvider } from './contexts/NotificationContext'
import { DirtyFormProvider } from './contexts/DirtyFormContext'
import { PromptProvider } from './contexts/PromptContext'

function AppRoutes() {
    const routing = useRoutes(routes)
    return routing
}

function App() {
    return (
        <Router>
            <NotificationProvider>
                <UserProvider>
                    <ThemeProvider theme={theme}>
                        <DirtyFormProvider>
                            <LoadingProvider>
                                <GlobalFonts />
                                <PromptProvider>
                                    <UseCasesProvider>
                                        <SessionProvider>
                                            <AppRoutes />
                                        </SessionProvider>
                                    </UseCasesProvider>
                                </PromptProvider>
                            </LoadingProvider>
                        </DirtyFormProvider>
                    </ThemeProvider>
                </UserProvider>
            </NotificationProvider>
        </Router>
    )
}

export default App
