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
import { handleData, setFormData } from '../redux/slices/urlSlice';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const topics = ['acquisition', 'activation', 'retention'];

const CreateUrlForm = () => {
  const dispatch = useDispatch();
  const { loading, formData, shortUrl } = useSelector((state) => state.url);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [aliasError, setAliasError] = useState('');
  const navigate = useNavigate();

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

    if (!isAuthenticated) {
      navigate('/login', {
        state: { redirectAfterLogin: '/', pendingUrlData: formData },
      });
      return;
    }

    await handleData(dispatch, formData);
  };

  const handleCopyUrl = () => {
    const fullUrl = shortUrl;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Short URL copied to clipboard!');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 4,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        '& .MuiTextField-root, & .MuiFormControl-root': {
          '& .MuiInputBase-root': {
            fontSize: { xs: '1rem', md: '1.2rem' },
            padding: { md: '4px 0' },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '1rem', md: '1.2rem' },
          },
        },
      }}
    >
      <TextField
        fullWidth
        label="Original URL"
        name="originalUrl"
        value={formData.originalUrl}
        onChange={handleChange}
        required
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
          },
        }}
      />
      <TextField
        fullWidth
        label="Custom Alias (optional)"
        name="customAlias"
        value={formData.customAlias}
        error={!!aliasError}
        helperText={aliasError}
        onChange={handleChange}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
          },
        }}
      />
      <FormControl fullWidth>
        <InputLabel>Topic </InputLabel>
        <Select
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          label="Topic"
          sx={{
            borderRadius: 2,
          }}
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
        size="large"
        disabled={loading}
        sx={{
          py: { xs: 1.5, md: 2 },
          fontSize: { xs: '1rem', md: '1.2rem' },
          borderRadius: 2,
        }}
      >
        {loading
          ? 'Creating...'
          : isAuthenticated
          ? 'Create Short URL'
          : 'Login to Create Short URL'}
      </Button>

      {shortUrl && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            width: '100%',
            backgroundColor: 'grey.50',
            borderRadius: 2,
            p: { xs: 2, md: 3 },
          }}
        >
          <TextField
            fullWidth
            label="Short URL"
            value={shortUrl}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                fontSize: { xs: '1rem', md: '1.2rem' },
              },
            }}
          />
          <Tooltip title="Copy to clipboard">
            <IconButton
              color="primary"
              onClick={handleCopyUrl}
              sx={{
                flexShrink: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                width: { xs: 40, md: 56 },
                height: { xs: 40, md: 56 },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ContentCopyIcon
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

CreateUrlForm.propTypes = {
  onUrlCreated: PropTypes.func,
};

export default CreateUrlForm;
