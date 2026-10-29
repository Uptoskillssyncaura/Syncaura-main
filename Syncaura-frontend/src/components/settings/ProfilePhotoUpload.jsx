import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFrontendProfilePhoto } from '../../redux/slices/authSlice'; 

export default function ProfilePhotoUpload() {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth || state.user || {});
  
  const defaultAvatar = "https://flaticon.com";
  
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || defaultAvatar);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG/JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      setPreviewUrl(base64String);
      
      dispatch(updateFrontendProfilePhoto(base64String));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(defaultAvatar);
    dispatch(updateFrontendProfilePhoto(null));
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Account Profile Photo</h3>
      
      <div style={styles.avatarWrapper}>
        <img src={previewUrl} alt="Avatar" style={styles.avatarImage} />
      </div>

      <div style={styles.btnGroup}>
        <label style={styles.uploadBtn}>
          Choose New Photo
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </label>
        
        {user?.profilePic && (
          <button onClick={handleRemovePhoto} style={styles.deleteBtn}>
            Remove Photo
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', maxWidth: '320px', textAlign: 'center', backgroundColor: '#fff' },
  title: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1a202c' },
  avatarWrapper: { width: '120px', height: '120px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #edf2f7' },
  avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  uploadBtn: { padding: '10px 16px', backgroundColor: '#3182ce', color: '#fff', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  deleteBtn: { padding: '10px 16px', backgroundColor: '#edf2f7', color: '#e53e3e', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }
};
