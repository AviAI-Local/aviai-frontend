import { useCallback, useState } from 'react'
import LoginForm from '../components/Authentication/LoginForm'
import SignUpForm from '../components/Authentication/SignUpForm'

function Auth() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const toggleMode = useCallback(() => {
        setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'))
    }, [])

    return <>{mode === 'login' ? <LoginForm onSwitchMode={toggleMode} /> : <SignUpForm onSwitchMode={toggleMode} />}</>
}

export default Auth
