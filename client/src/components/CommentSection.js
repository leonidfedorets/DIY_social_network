import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import api from '../utils/api';

const Wrap = styled.div`margin-top:20px;`;
const Title = styled.h4`
  font-size:0.9rem;font-weight:700;color:#b8a07a;
  margin-bottom:14px;display:flex;align-items:center;gap:8px;
`;
const CommentList = styled.div`display:flex;flex-direction:column;gap:10px;margin-bottom:14px;`;
const CommentCard = styled.div`
  background:rgba(245,158,11,0.03);border:1px solid rgba(245,158,11,0.08);
  border-radius:10px;padding:12px 16px;
  display:flex;justify-content:space-between;align-items:flex-start;gap:10px;
`;
const CLeft = styled.div`flex:1;`;
const CAuthor = styled.div`font-size:0.8rem;font-weight:700;color:#f59e0b;margin-bottom:4px;`;
const CContent = styled.div`font-size:0.88rem;color:#b8a07a;line-height:1.6;`;
const CTime = styled.div`font-size:0.72rem;color:#6b5a3e;margin-top:4px;`;
const DelBtn = styled.button`
  background:transparent;border:none;color:#6b5a3e;cursor:pointer;
  padding:4px;border-radius:6px;transition:all 0.15s;flex-shrink:0;
  &:hover{color:#ef4444;background:rgba(239,68,68,0.1);}
`;
const Form = styled.form`display:flex;gap:8px;`;
const Input = styled.input`
  flex:1;padding:10px 14px;
  background:rgba(255,248,220,0.04);border:1px solid rgba(245,158,11,0.15);
  border-radius:8px;color:#fef3c7;font-size:0.88rem;
  &::placeholder{color:#6b5a3e;}
  &:focus{outline:none;border-color:#f59e0b;background:rgba(245,158,11,0.06);}
`;
const SendBtn = styled.button`
  padding:10px 14px;background:linear-gradient(135deg,#f59e0b,#d97706);
  border:none;border-radius:8px;color:#0e0c0a;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:700;
  transition:all 0.15s;
  &:hover{opacity:0.9;}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;
const Empty = styled.div`font-size:0.85rem;color:#6b5a3e;text-align:center;padding:12px;`;

const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/api/posts/${postId}/comments`)
      .then(r => setComments(r.data))
      .catch(() => {});
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/posts/${postId}/comments`, { content: text.trim(), username: user.username });
      setComments([res.data, ...comments]);
      setText('');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const del = async (id) => {
    try {
      await api.delete(`/api/posts/${postId}/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <Wrap>
      <Title><FiMessageCircle size={14} /> Discussion ({comments.length})</Title>
      {comments.length === 0 && <Empty>No comments yet. Be the first!</Empty>}
      <CommentList>
        {comments.map(c => (
          <CommentCard key={c._id}>
            <CLeft>
              <CAuthor>{c.username}</CAuthor>
              <CContent>{c.content}</CContent>
              <CTime>{new Date(c.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</CTime>
            </CLeft>
            {(user?.username === c.username || user?.role === 'admin') && (
              <DelBtn onClick={() => del(c._id)} title="Delete"><FiTrash2 size={13} /></DelBtn>
            )}
          </CommentCard>
        ))}
      </CommentList>
      {user ? (
        <Form onSubmit={submit}>
          <Input
            placeholder="Write a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={2000}
          />
          <SendBtn type="submit" disabled={loading || !text.trim()}>
            <FiSend size={13} /> Post
          </SendBtn>
        </Form>
      ) : (
        <Empty>Sign in to leave a comment</Empty>
      )}
    </Wrap>
  );
};
export default CommentSection;
