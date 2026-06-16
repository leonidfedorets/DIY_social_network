import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiThumbsUp, FiHeart, FiSmile, FiFrown, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import Avatar from './Avatar';
import EditModal from './EditModal';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import api from '../utils/api';

const Section = styled.section``;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    border-radius: 2px;
  }
`;

const Card = styled.article`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 16px;
  transition: var(--transition);
  animation: fadeIn 0.3s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TimeStamp = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PostTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
`;

const PostBody = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 10px;

  img { max-width: 100%; border-radius: var(--radius-sm); margin: 8px 0; }
  p { margin-bottom: 8px; }
  h1, h2, h3 { color: var(--text-primary); margin: 12px 0 6px; }
  ul, ol { padding-left: 20px; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const Reactions = styled.div`
  display: flex;
  gap: 8px;
`;

const ReactionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${p => p.$active ? 'var(--accent-primary)' : 'var(--border)'};
  background: ${p => p.$active ? 'rgba(124,58,237,0.15)' : 'transparent'};
  color: ${p => p.$active ? 'var(--accent-primary)' : 'var(--text-muted)'};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.1);
    transform: scale(1.05);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover { color: ${p => p.$danger ? 'var(--danger)' : 'var(--text-primary)'}; border-color: ${p => p.$danger ? 'var(--danger)' : 'var(--accent-primary)'}; }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid ${p => p.$active ? 'var(--accent-primary)' : 'var(--border)'};
  background: ${p => p.$active ? 'var(--accent-primary)' : 'transparent'};
  color: ${p => p.$active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);

  &:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
`;

const Empty = styled.div`
  text-align: center;
  padding: 48px;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const REACTION_MAP = [
  { key: 'like', icon: <FiThumbsUp size={13} /> },
  { key: 'love', icon: <FiHeart size={13} /> },
  { key: 'laugh', icon: <FiSmile size={13} /> },
  { key: 'angry', icon: <FiFrown size={13} /> },
];

const PostList = ({ user, externalPosts }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editPostId, setEditPostId] = useState(null);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (externalPosts?.length > 0) {
      setPosts(prev => {
        const ids = new Set(prev.map(p => p._id));
        const newOnes = externalPosts.filter(p => !ids.has(p._id));
        return [...newOnes, ...prev];
      });
    }
  }, [externalPosts]);

  const handleReaction = async (postId, reaction) => {
    if (!user) return;
    try {
      const response = await api.post(`/api/posts/${postId}/react`, { reaction, user: user.username });
      setPosts(posts.map(p => p._id === postId ? { ...p, reactions: response.data.reactions } : p));
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const countReaction = (post, reaction) =>
    post.reactions ? post.reactions.filter(r => r === reaction).length : 0;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <Section>
      <SectionTitle>Community Projects</SectionTitle>
      {currentPosts.length === 0 ? (
        <Empty>No projects yet. Be the first to share something!</Empty>
      ) : (
        currentPosts.map(post => (
          <Card key={post._id}>
            <CardHeader>
              <AuthorInfo>
                <Avatar username={post.username} />
              </AuthorInfo>
              <TimeStamp>
                <FiClock size={11} />
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </TimeStamp>
            </CardHeader>

            <PostTitle>{post.title}</PostTitle>
            {post.description && (
              <PostBody dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.description) }} />
            )}
            {post.instructions && (
              <>
                <Divider />
                <PostBody dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.instructions) }} />
              </>
            )}

            <Divider />

            <CardFooter>
              <Reactions>
                {REACTION_MAP.map(({ key, icon }) => (
                  <ReactionBtn
                    key={key}
                    $active={post.reactions?.includes(key)}
                    onClick={() => handleReaction(post._id, key)}
                    title={key}
                  >
                    {icon} {countReaction(post, key) || ''}
                  </ReactionBtn>
                ))}
              </Reactions>

              {(user?.username === post.username || user?.role === 'admin') && (
                <Actions>
                  <ActionBtn onClick={() => setEditPostId(post._id)}>
                    <FiEdit2 size={12} /> Edit
                  </ActionBtn>
                  <ActionBtn $danger onClick={() => handleDelete(post._id)}>
                    <FiTrash2 size={12} /> Delete
                  </ActionBtn>
                </Actions>
              )}
            </CardFooter>
          </Card>
        ))
      )}

      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn key={i} $active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </PageBtn>
          ))}
        </Pagination>
      )}

      {editPostId && (
        <EditModal
          postId={editPostId}
          currentUser={user}
          onClose={() => setEditPostId(null)}
          onPostUpdate={handlePostUpdate}
        />
      )}
    </Section>
  );
};

export default PostList;
