import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

const Wrapper = styled.div`animation: fadeIn 0.3s ease;`;

const PageTitle = styled.h2`
  font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 24px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 20px; display: flex; align-items: center; gap: 14px; transition: var(--transition);
  animation: fadeIn 0.3s ease;
  &:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
`;

const AvatarImg = styled.img`
  width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--accent-primary);
`;

const Info = styled.div`flex: 1; min-width: 0;`;

const Name = styled.div`font-weight: 700; color: var(--text-primary); font-size: 0.95rem; truncate: ellipsis;`;

const Meta = styled.div`font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;`;

const Badge = styled.span`
  display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600;
  background: ${p => p.$admin ? 'rgba(124,58,237,0.2)' : 'rgba(59,130,246,0.15)'};
  color: ${p => p.$admin ? '#a78bfa' : '#60a5fa'};
  border: 1px solid ${p => p.$admin ? 'rgba(124,58,237,0.3)' : 'rgba(59,130,246,0.25)'};
  margin-top: 4px;
`;

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/api/users/all')
      .then(r => setUsers(r.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <Wrapper>
      <PageTitle>Community Members</PageTitle>
      <Grid>
        {users.map(user => (
          <Card key={user._id}>
            <AvatarImg
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7c3aed&color=fff&bold=true`}
              alt={user.username}
            />
            <Info>
              <Name>{user.username}</Name>
              <Meta>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Meta>
              <Badge $admin={user.role === 'admin'}>{user.role}</Badge>
            </Info>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Users;
