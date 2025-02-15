import { createContext, useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUrlsApi } from '../apis';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState([]);
  const [totalUrls, setTotalUrls] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // login method to store user data in local storage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  // logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch URLs from the API with optional topic filtering
  const fetchUrls = async ({ page = 1, limit = 7 } = {}) => {
    try {
      const params = { page, limit };
      const data = await getUrlsApi(params);
      setUrls(data.urls);
      setTotalUrls(data.total);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        setLoading,
        urls,
        totalUrls,
        fetchUrls,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
