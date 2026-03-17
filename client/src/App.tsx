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
import { ApiNotificationProvider } from './contexts/ApiNotificationContext'
import ApiNotificationStack from './components/common/ApiNotificationStack'

function AppRoutes() {
    const routing = useRoutes(routes)
    return routing
}

function App() {
    return (
        <Router>
            <ApiNotificationProvider>
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
                                    <ApiNotificationStack />
                                </LoadingProvider>
                            </DirtyFormProvider>
                        </ThemeProvider>
                    </UserProvider>
                </NotificationProvider>
            </ApiNotificationProvider>
        </Router>
    )
}

export default App
