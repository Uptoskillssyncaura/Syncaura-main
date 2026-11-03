import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFrontendProfilePhoto } from '../../redux/slices/authSlice'; // Verify your working slice path here

export default function AvatarManager({ size = "44px", editable = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);

  const userInitial = (user?.first_name || user?.name || "U").charAt(0).toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setShowMenu(false);
    if (!file || !file.type.startsWith('image/')) return alert('Please select a valid image file.');

    const reader = new FileReader();
    reader.onloadend = () => dispatch(updateFrontendProfilePhoto(reader.result));
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setShowMenu(false);
    if (window.confirm("Remove profile picture?")) {
      dispatch(updateFrontendProfilePhoto(null));
    }
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block', flexShrink: 0 }}>
      
      {/* 🖼️ Avatar Container */}
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
        {user?.profilePic ? (
          <img 
            src={user.profilePic} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-red-600 to-red-900 text-white flex items-center justify-center font-semibold text-lg sm:text-xl">
            {userInitial}
          </div>
        )}
      </div>

      {/* 📷 Clean Camera Trigger Badge */}
      {editable && (
        <button
          onClick={() => setShowMenu(true)}
          style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#075E54', border: 'none', padding: '4px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', color: '#fff', fontSize: '11px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', zIndex: 5 }}
        >
          📷
        </button>
      )}

      {/* BOTTOM MODAL */}
      {showMenu && (
        <>
          {/* Backdrop Mask */}
          <div 
            onClick={() => setShowMenu(false)} 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9998 }} 
          />

          {/* Centered, Resized Bottom Sheet Drawer */}
          <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '20px 24px', zIndex: 9999, fontFamily: 'sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'slideUpFixed 0.25s cubic-bezier(0.1, 0.76, 0.55, 0.94)' }}>
            
            {/* Grabber top pill */}
            <div style={{ width: '36px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', margin: '-8px auto 16px' }} />

            {/* Header section row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setShowMenu(false)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#4a5568', fontWeight: 'bold' }}>✕</button>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Profile picture</span>
              </div>
              
              {user?.profilePic && (
                <button onClick={handleRemovePhoto} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#e53e3e' }} title="Delete photo">
                  🗑️
                </button>
              )}
            </div>

            {/* Centered options container grid */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '8px 0' }}>
            
              {/* Gallery */}
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#4a5568', fontSize: '13px', fontWeight: '500' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', backgroundColor: '#f8fafc' }}>
                  🖼️
                </div>
                <span>Gallery</span>
                <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </label>

            </div>
          </div>

          <style>{`
            @keyframes slideUpFixed {
              from { transform: translate(-50%, 100%); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
