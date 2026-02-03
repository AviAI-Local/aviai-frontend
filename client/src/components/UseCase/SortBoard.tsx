import { Box, Typography } from "@mui/material"
import { useUseCasesContext } from "../../contexts/UseCasesContext";

type SortBoardProps = {
  options: string[];
  choice: string | null;
  setChoice: React.Dispatch<React.SetStateAction<string | null>>;
};


function SortBoard({ options, choice, setChoice }: SortBoardProps) {
    const { sortUseCase } = useUseCasesContext()
    return (
        <Box
            sx={{
                animation: 'fadeInUp 0.3s ease-out',
                '@keyframes fadeInUp': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(10px)'
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                },
                backgroundColor: 'white',
                width: 140,
                borderRadius: 2,
                paddingY: 1,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                gap: 1
            }}
        >
            {options.map((option) => {
                const isSelected = option === choice
                return (
                    <Typography
                        key={option}
                        onClick={async () => {
                            if (isSelected) {
                                setChoice(null) 
                            } else {
                                setChoice(option)
                                console.log(option)
                                await sortUseCase(option == "Name", option == "Created Date")
                            }
                        }}
                        sx={{
                            color: isSelected ? 'white' : '#9FA7BE',
                            backgroundColor: isSelected ? '#3D64FD' : '',
                            fontWeight: 500,
                            fontSize: 14,
                            height: 32,
                            paddingX: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 1.5,
                            mx: 1,
                            cursor: 'pointer',
                            transition: '0.2s',
                            '&:hover': {
                                backgroundColor: '#3D64FD',
                                color: 'white'
                            }
                        }}
                    >
                        {option}
                    </Typography>
                )
            })}
        </Box>
    )
}

export default SortBoard