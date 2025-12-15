import { ConversionStatus } from '@org/models';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type StatusProps = {
  status: ConversionStatus;
  progress: number;
};

const Status = ({ status, progress }: StatusProps) => {
  switch (status) {
    case ConversionStatus.PROCESSING:
      return <CircularProgressWithLabel value={progress} />
    case ConversionStatus.COMPLETED:
      return <CheckCircleIcon fontSize={"large"} color={"success"}/>
    case ConversionStatus.PENDING:
      return "hi"
    case ConversionStatus.FAILED:
      return <HighlightOffIcon fontSize={"large"} color={"error"}/>
    default:
      return null;
  }
};

export default Status;
