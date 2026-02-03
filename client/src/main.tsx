import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from './contexts/ConfigContext.tsx'
import { ConnectionProvider } from './contexts/ConnectionContext.tsx'

createRoot(document.getElementById('root')!).render(
    <ConfigProvider>
        <ConnectionProvider>
            <App />
        </ConnectionProvider>
    </ConfigProvider>
)
