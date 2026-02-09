
import AuthLayout from '../components/layout/AuthLayout'
import Auth from '../pages/Auth'
import UseCaseList from '../pages/UseCaseList'
import UseCaseDetails from '../pages/UseCaseDetails'
import Home from '../pages/Home'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'
import Interview from '../pages/InterviewV2'
import History from '../pages/History'
import Notes from '../pages/Notes'
import Profile from '../pages/Profile'

export const routes = [
    {
        element: <PublicRoutes />,
        children: [
            {
                element: <AuthLayout />,
                children: [{ path: '/auth', element: <Auth /> }]
            }
        ]
    },
    {
        element: <PrivateRoutes />,
        children: [
            // { path: '/', element: <Home /> },
            { path: '/scenarios', element: <UseCaseList /> },
            { path: '/scenarios/:id', element: <UseCaseDetails /> },
            { path: '/interview/:id', element: <Interview /> },
            { path: '/history', element: <History /> },
            { path: '/notes', element: <Notes /> },
            { path: '/profile', element: <Profile /> }
        ]
    }
]
