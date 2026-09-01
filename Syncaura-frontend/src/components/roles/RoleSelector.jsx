import React from 'react';

const RoleSelector = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { id: 'admin', label: 'Admin', sub: 'Register as an admin' },
    { id: 'co-admin', label: 'Co-Admin', sub: 'Register as a co-admin' },
    { id: 'user', label: 'User', sub: 'Register as a user' }
  ];

  return (
    <div className="w-full mb-6 font-poppin-reg">
      {/* Label for the selection group */}
      <label className="block text-sm font-medium mb-2 role-label-text">
        Select Registration Role
      </label>
      
      {/* 3 Button Grid Layout */}
      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => {
          const isActive = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              className={`role-btn ${isActive ? 'active' : ''}`}
            >
              <span className={`role-label ${isActive ? 'font-semibold' : ''}`}>
                {role.label}
              </span>
              <span className="role-sub">
                {role.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
