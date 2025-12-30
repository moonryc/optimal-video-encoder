import { useRef, useState, type ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useUploadFileMutation } from '../hooks/api/useUploadFileMutation';

interface HeaderProps {
  isDeleteMode?: boolean;
  onToggleDeleteMode?: () => void;
  onOpenConfirmModal?: () => void;
  selectedCount?: number;
}

const Header = ({
  isDeleteMode = false,
  onToggleDeleteMode,
  onOpenConfirmModal,
  selectedCount = 0,
}: HeaderProps) => {
  const { mutate, isLoading, progress, error } = useUploadFileMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedName(file.name);
    setSuccessMessage(null);

    try {
      await mutate(file);
      setSuccessMessage(`Uploaded ${file.name}`);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      // Error state handled by hook.
    }
  };

  const errorMessage =
    error instanceof Error ? error.message : 'Upload failed';

  return (
    <Box mb={3}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            component="label"
            disabled={isLoading || isDeleteMode}
          >
            Upload Video
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="video/*,.mkv,.mov,.avi,.webm,.wmv,.flv,.mp4"
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="outlined"
            color={isDeleteMode ? 'inherit' : 'error'}
            onClick={onToggleDeleteMode}
            disabled={isLoading}
          >
            {isDeleteMode ? 'Cancel' : 'Delete'}
          </Button>
          {isDeleteMode && (
            <Button
              variant="contained"
              color="error"
              onClick={onOpenConfirmModal}
              disabled={selectedCount === 0}
            >
              Confirm Deletion ({selectedCount})
            </Button>
          )}
          {selectedName && !isDeleteMode && (
            <Typography variant="body2" component="span">
              {selectedName}
            </Typography>
          )}
        </Box>
        {isLoading && <LinearProgress variant="determinate" value={progress} />}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Box>
  );
};

export default Header;
