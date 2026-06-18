import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiFileText, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import api from '../utils/api';

const Wrap = styled.div``;
const PageTitle = styled.h2`
  font-size:1.6rem;font-weight:900;color:#fef3c7;margin-bottom:6px;
  span{color:#f59e0b;}
`;
const Sub = styled.p`color:#6b5a3e;font-size:0.9rem;margin-bottom:32px;`;
const Tabs = styled.div`display:flex;gap:4px;margin-bottom:24px;`;
const Tab = styled.button`
  padding:9px 20px;border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;transition:all 0.2s;
  border:1px solid ${p=>p.$a?'#f59e0b':'rgba(245,158,11,0.15)'};
  background:${p=>p.$a?'rgba(245,158,11,0.15)':'transparent'};
  color:${p=>p.$a?'#f59e0b':'#b8a07a'};display:flex;align-items:center;gap:7px;
  &:hover{border-color:#f59e0b;color:#f59e0b;}
`;
const Card = styled.div`background:rgba(255,248,220,0.03);border:1px solid rgba(245,158,11,0.12);border-radius:16px;overflow:hidden;`;
const Table = styled.table`width:100%;border-collapse:collapse;`;
const Th = styled.th`
  padding:13px 16px;text-align:left;font-size:0.72rem;font-weight:700;color:#b8a07a;
  text-transform:uppercase;letter-spacing:0.08em;background:rgba(245,158,11,0.04);
  border-bottom:1px solid rgba(245,158,11,0.1);
`;
const Td = styled.td`
  padding:13px 16px;font-size:0.875rem;color:#b8a07a;
  border-bottom:1px solid rgba(245,158,11,0.06);
  &:last-child{border-right:none;}
`;
const Tr = styled.tr`
  transition:all 0.15s;
  &:hover td{background:rgba(245,158,11,0.02);}
  &:last-child td{border-bottom:none;}
`;
const RoleSelect = styled.select`
  padding:5px 10px;background:rgba(255,248,220,0.04);border:1px solid rgba(245,158,11,0.15);
  border-radius:6px;color:#fef3c7;font-size:0.8rem;cursor:pointer;
  option{background:#161310;}
  &:focus{outline:none;border-color:#f59e0b;}
`;
const Badge = styled.span`
  display:inline-flex;align-items:center;padding:3px 9px;border-radius:10px;font-size:0.7rem;font-weight:700;
  background:${p=>p.$admin?'rgba(245,158,11,0.15)':'rgba(59,130,246,0.12)'};
  color:${p=>p.$admin?'#f59e0b':'#60a5fa'};
  border:1px solid ${p=>p.$admin?'rgba(245,158,11,0.25)':'rgba(59,130,246,0.2)'};
`;
const CatBadge = styled.span`
  display:inline-flex;padding:3px 8px;border-radius:8px;font-size:0.7rem;font-weight:600;
  background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);color:#f59e0b;
`;
const DelBtn = styled.button`
  background:transparent;border:1px solid rgba(239,68,68,0.2);color:#6b5a3e;
  padding:5px 9px;border-radius:6px;font-size:0.75rem;cursor:pointer;
  display:flex;align-items:center;gap:4px;transition:all 0.15s;
  &:hover{color:#ef4444;border-color:#ef4444;background:rgba(239,68,68,0.08);}
`;
const PermGrid = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const Perm = styled.label`
  display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.72rem;font-weight:600;
  color:${p=>p.$on?'#22c55e':'#6b5a3e'};padding:3px 8px;border-radius:8px;
  border:1px solid ${p=>p.$on?'rgba(34,197,94,0.25)':'rgba(245,158,11,0.1)'};
  background:${p=>p.$on?'rgba(34,197,94,0.08)':'transparent'};transition:all 0.15s;
  input{display:none;}
  &:hover{border-color:#f59e0b;color:#f59e0b;}
`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:24px;`;
const StatCard = styled.div`
  background:rgba(255,248,220,0.03);border:1px solid rgba(245,158,11,0.12);border-radius:12px;padding:18px 20px;
  .sv{font-size:2rem;font-weight:900;color:#f59e0b;}
  .sl{font-size:0.78rem;color:#6b5a3e;text-transform:uppercase;letter-spacing:0.06em;margin-top:3px;}
`;
const Mono = styled.span`font-family:monospace;font-size:0.68rem;color:#6b5a3e;`;

const Backoffice = ({ user }) => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    api.get('/api/users/all').then(r=>setUsers(r.data)).finally(()=>setLoading(false));
  };
  const loadPosts = () => {
    setLoading(true);
    api.get('/api/posts/admin/all').then(r=>setPosts(r.data)).finally(()=>setLoading(false));
  };

  useEffect(() => { loadUsers(); loadPosts(); }, []);

  const changeRole = async (id, role) => {
    await api.put(`/api/users/${id}/role`, { role });
    setUsers(users.map(u=>u._id===id?{...u,role}:u));
  };
  const changePerm = async (id, perm, val) => {
    const target = users.find(u=>u._id===id);
    const perms = {...target.permissions,[perm]:val};
    await api.put(`/api/users/${id}/permissions`, { permissions: perms });
    setUsers(users.map(u=>u._id===id?{...u,permissions:perms}:u));
  };
  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/api/posts/${id}`);
    setPosts(posts.filter(p=>p._id!==id));
  };

  const adminCount = users.filter(u=>u.role==='admin').length;

  return (
    <Wrap>
      <PageTitle>Admin <span>Panel</span></PageTitle>
      <Sub>Manage users, permissions and content moderation</Sub>

      <Stats>
        <StatCard><div className="sv">{users.length}</div><div className="sl">Total Users</div></StatCard>
        <StatCard><div className="sv">{adminCount}</div><div className="sl">Admins</div></StatCard>
        <StatCard><div className="sv">{posts.length}</div><div className="sl">Total Posts</div></StatCard>
        <StatCard><div className="sv">{posts.reduce((s,p)=>s+(p.viewCount||0),0)}</div><div className="sl">Total Views</div></StatCard>
      </Stats>

      <Tabs>
        <Tab $a={tab==='users'} onClick={()=>setTab('users')}><FiUsers size={14}/>Users ({users.length})</Tab>
        <Tab $a={tab==='posts'} onClick={()=>setTab('posts')}><FiFileText size={14}/>Posts ({posts.length})</Tab>
      </Tabs>

      {tab==='users' && (
        <Card>
          <Table>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>ID</Th>
                <Th>Joined</Th>
                <Th>Role</Th>
                <Th>Permissions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <Tr key={u._id}>
                  <Td style={{fontWeight:700,color:'#fef3c7'}}>{u.username}</Td>
                  <Td><Mono>{u._id}</Mono></Td>
                  <Td><Mono>{new Date(u.createdAt).toLocaleDateString()}</Mono></Td>
                  <Td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <Badge $admin={u.role==='admin'}>{u.role}</Badge>
                      <RoleSelect value={u.role} onChange={e=>changeRole(u._id,e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </RoleSelect>
                    </div>
                  </Td>
                  <Td>
                    <PermGrid>
                      {['create','read','update','delete'].map(p=>(
                        <Perm key={p} $on={u.permissions?.[p]}>
                          <input type="checkbox" checked={u.permissions?.[p]||false}
                            onChange={e=>changePerm(u._id,p,e.target.checked)} />
                          {p}
                        </Perm>
                      ))}
                    </PermGrid>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab==='posts' && (
        <Card>
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Category</Th>
                <Th>Rating</Th>
                <Th>Views</Th>
                <Th>Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p=>(
                <Tr key={p._id}>
                  <Td style={{color:'#fef3c7',fontWeight:600,maxWidth:200}}>{p.title}</Td>
                  <Td>{p.username}</Td>
                  <Td>{p.category&&<CatBadge>{p.category}</CatBadge>}</Td>
                  <Td style={{color:'#f59e0b',fontWeight:700}}>{p.avgRating||0}/100</Td>
                  <Td>{p.viewCount||0}</Td>
                  <Td><Mono>{new Date(p.createdAt).toLocaleDateString()}</Mono></Td>
                  <Td>
                    <DelBtn onClick={()=>deletePost(p._id)}><FiTrash2 size={11}/>Delete</DelBtn>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Wrap>
  );
};
export default Backoffice;
