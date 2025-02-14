import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { toast } from 'react-toastify';
import { shortenUrlApi } from '../apis/index';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const topics = ['acquisition', 'activation', 'retention'];

const CreateUrlForm = ({ onUrlCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    topic: '',
  });
  const { loading, setLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await shortenUrlApi(formData);
      toast.success('URL shortened successfully!');
      setFormData({ originalUrl: '', customAlias: '', topic: '' });
      onUrlCreated();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
    </Box>
  );
};

CreateUrlForm.propTypes = {
  onUrlCreated: PropTypes.func.isRequired,
};

export default CreateUrlForm;
