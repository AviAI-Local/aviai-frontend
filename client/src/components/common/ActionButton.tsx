import { Button, type ButtonProps } from '@mui/material'

type ActionButtonType = 'primary' | 'secondary' | 'danger'

interface ActionButtonProps extends Omit<ButtonProps, 'color'> {
    actionType: ActionButtonType
}

function ActionButton({ actionType, ...props }: ActionButtonProps) {
    switch (actionType) {
        case 'primary':
            return (
                <Button
                    size='large'
                    variant='outlined'
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'primary.main'
                        }
                    }}
                    {...props}
                />
            )
        case 'danger':
            return (
                <Button
                    size='large'
                    variant='outlined'
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: 'error.main',
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'error.main'
                        }
                    }}
                    {...props}
                />
            )
        default:
            return (
                <Button
                    size='large'
                    variant='outlined'
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: 'text.secondary',
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'text.secondary',
                            color: 'white'
                        }
                    }}
                    {...props}
                />
            )
    }
}

export default ActionButton
