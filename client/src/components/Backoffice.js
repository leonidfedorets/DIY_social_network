import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

const Wrapper = styled.div`animation: fadeIn 0.3s ease;`;

const PageTitle = styled.h2`
  font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 24px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
`;

const TableCard = styled.div`
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;

const Th = styled.th`
  padding: 14px 16px; text-align: left; font-size: 0.75rem; font-weight: 700;
  color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em;
  background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 14px 16px; font-size: 0.875rem; color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  &:last-child { border-right: none; }
`;

const Tr = styled.tr`
  transition: var(--transition);
  &:hover td { background: rgba(255,255,255,0.02); }
  &:last-child td { border-bottom: none; }
`;

const RoleSelect = styled.select`
  padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.8rem; cursor: pointer;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--accent-primary); }
  option { background: var(--bg-secondary); }
`;

const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: 600;
  background: ${p => p.$admin ? 'rgba(124,58,237,0.2)' : 'rgba(59,130,246,0.15)'};
  color: ${p => p.$admin ? '#a78bfa' : '#60a5fa'};
  border: 1px solid ${p => p.$admin ? 'rgba(124,58,237,0.3)' : 'rgba(59,130,246,0.25)'};
`;

const PermGrid = styled.div`display: flex; gap: 8px; flex-wrap: wrap;`;

const PermToggle = styled.label`
  display: flex; align-items: center; gap: 5px; cursor: pointer;
  font-size: 0.75rem; color: ${p => p.$on ? 'var(--success)' : 'var(--text-muted)'};
  padding: 4px 8px; border-radius: 12px; border: 1px solid ${p => p.$on ? 'rgba(34,197,94,0.3)' : 'var(--border)'};
  background: ${p => p.$on ? 'rgba(34,197,94,0.1)' : 'transparent'};
  transition: var(--transition);
  input { display: none; }
  &:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
`;

const MonoText = styled.span`
  font-family: monospace; font-size: 0.7rem; color: var(--text-muted);
`;

const Backoffice = ({ user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/api/users/all')
      .then(r => setUsers(r.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handlePermissionChange = async (userId, permission, value) => {
    try {
      const target = users.find(u => u._id === userId);
      const updatedPermissions = { ...target.permissions, [permission]: value };
      await api.put(`/api/users/${userId}/permissions`, { permissions: updatedPermissions });
      setUsers(users.map(u => u._id === userId ? { ...u, permissions: updatedPermissions } : u));
    } catch (err) {
      console.error('Error updating permissions:', err);
    }
  };

  return (
    <Wrapper>
      <PageTitle>Backoffice</PageTitle>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>ID</Th>
              <Th>Role</Th>
              <Th>Permissions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <Tr key={u._id}>
                <Td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.username}</Td>
                <Td><MonoText>{u._id}</MonoText></Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge $admin={u.role === 'admin'}>{u.role}</Badge>
                    <RoleSelect value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </RoleSelect>
                  </div>
                </Td>
                <Td>
                  <PermGrid>
                    {['create', 'read', 'update', 'delete'].map(perm => (
                      <PermToggle key={perm} $on={u.permissions?.[perm]}>
                        <input
                          type="checkbox"
                          checked={u.permissions?.[perm] || false}
                          onChange={e => handlePermissionChange(u._id, perm, e.target.checked)}
                        />
                        {perm}
                      </PermToggle>
                    ))}
                  </PermGrid>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Wrapper>
  );
};

export default Backoffice;
