import { SvgIcon} from "@mui/material";
import type { CustomIconProps } from "./types";



const HomeIcon = ({ baseColor = '#3D64FD', accentColor = '#FCADBD', ...props }: CustomIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <path
        d="M12 14H4C2.89533 14 2 13.1047 2 12V5.84333C2 5.11667 2.394 4.448 3.02867 4.09533L7.02867 1.87333C7.63267 1.538 8.36733 1.538 8.97133 1.87333L12.9713 4.09533C13.606 4.448 14 5.11733 14 5.84333V12C14 13.1047 13.1047 14 12 14Z"
        fill={baseColor}
      />
      <path
        d="M10 14H6V10C6 9.26333 6.59667 8.66666 7.33333 8.66666H8.66667C9.40333 8.66666 10 9.26333 10 10V14Z"
        fill={accentColor}
      />
    </SvgIcon>
  );
};

export default HomeIcon;
