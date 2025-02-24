import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { createShortUrl, setFormData } from '../redux/slices/urlSlice';
import PropTypes from 'prop-types';

const topics = ['acquisition', 'activation', 'retention'];
const BASE_URL = import.meta.env.VITE_API_URL;

const CreateUrlForm = ({ onUrlCreated }) => {
  const dispatch = useDispatch();
  const { loading, formData, shortUrl } = useSelector((state) => state.url);
  const [aliasError, setAliasError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customAlias') {
      if (value && value.length > 0 && value.length < 8) {
        setAliasError('Custom alias must be at least 8 characters');
      } else {
        setAliasError('');
      }
    }
    dispatch(setFormData({ [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createShortUrl(formData)).unwrap();
      dispatch(
        setFormData({
          originalUrl: '',
          customAlias: '',
          topic: '',
        })
      );
      onUrlCreated();
    } catch (err) {
      toast.error(err.message || 'Failed to create short URL');
    }
  };

  const handleCopyUrl = () => {
    const fullUrl = shortUrl;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Short URL copied to clipboard!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Original URL"
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
        error={!!aliasError}
        helperText={aliasError}
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
