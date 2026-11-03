// Syncaura-frontend/src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      padding: '0 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '96px', margin: '0', color: '#4F46E5', fontWeight: '800' }}>404</h1>
      <h2 style={{ fontSize: '28px', margin: '10px 0 20px 0', color: '#1F2937' }}>Page Not Found</h2>
      <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '400px', marginBottom: '30px', lineHeight: '1.5' }}>
        The link you followed may be broken, or the page may have been removed by an administrator.
      </p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4338CA'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4F46E5'}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;

