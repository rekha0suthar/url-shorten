import { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const topics = ['acquisition', 'activation', 'retention'];

const CreateUrlForm = () => {
  const {
    loading,
    formData,
    setFormData,
    shortUrl,
    handleSubmit,
    setShortUrl,
  } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCopyUrl = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast.success('Short URL copied to clipboard!');
    }
  };

  useEffect(() => {
    setShortUrl('');
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Orignal URL"
        name="originalUrl"
        value={formData.originalUrl}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Custom Alias (optional)"
        name="customAlias"
        value={formData.customAlias}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Topic (optional)</InputLabel>
        <Select
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          label="Topic (optional)"
        >
          <MenuItem value="others">
            <em>Others</em>
          </MenuItem>
          {topics.map((topic) => (
            <MenuItem key={topic} value={topic}>
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Short URL'}
      </Button>

      {shortUrl && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <TextField
            fullWidth
            label="Short URL"
            value={shortUrl}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Tooltip title="Copy to clipboard">
            <IconButton color="primary" onClick={handleCopyUrl}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

CreateUrlForm.propTypes = {
  onUrlCreated: PropTypes.func.isRequired,
};

export default CreateUrlForm;
