import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiThumbsUp, FiHeart, FiSmile, FiFrown, FiEdit2, FiTrash2, FiClock, FiEye, FiFilter } from 'react-icons/fi';
import Avatar from './Avatar';
import EditModal from './EditModal';
import RatingWidget from './RatingWidget';
import CommentSection from './CommentSection';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import api from '../utils/api';

const Section = styled.section``;
const Controls = styled.div`display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;align-items:center;`;
const FilterBtn = styled.button`
  padding:7px 14px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.2s;
  border:1px solid ${p=>p.$active?'#f59e0b':'rgba(245,158,11,0.15)'};
  background:${p=>p.$active?'rgba(245,158,11,0.15)':'transparent'};
  color:${p=>p.$active?'#f59e0b':'#b8a07a'};
  &:hover{border-color:#f59e0b;color:#f59e0b;}
`;
const SortSelect = styled.select`
  padding:7px 12px;background:rgba(255,248,220,0.04);border:1px solid rgba(245,158,11,0.15);
  border-radius:8px;color:#b8a07a;font-size:0.82rem;cursor:pointer;margin-left:auto;
  option{background:#161310;}
  &:focus{outline:none;border-color:#f59e0b;}
`;
const SectionTitle = styled.h3`
  font-size:1.05rem;font-weight:700;color:#fef3c7;margin-bottom:16px;
  display:flex;align-items:center;gap:8px;
  &::before{content:'';display:block;width:4px;height:20px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:2px;}
`;
const Card = styled.article`
  background:rgba(255,248,220,0.03);border:1px solid rgba(245,158,11,0.1);
  border-radius:16px;padding:24px;margin-bottom:16px;transition:all 0.25s;
  &:hover{border-color:rgba(245,158,11,0.25);box-shadow:0 8px 32px rgba(0,0,0,0.4);}
`;
const CardHeader = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;`;
const Meta = styled.div`display:flex;align-items:center;gap:10px;flex-wrap:wrap;`;
const TimeStamp = styled.span`font-size:0.73rem;color:#6b5a3e;display:flex;align-items:center;gap:4px;`;
const CatBadge = styled.span`
  font-size:0.72rem;font-weight:700;padding:3px 9px;border-radius:10px;
  background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#f59e0b;
`;
const DiffBadge = styled.span`
  font-size:0.72rem;font-weight:600;padding:3px 9px;border-radius:10px;
  background:${p=>p.d==='beginner'?'rgba(34,197,94,0.1)':p.d==='intermediate'?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)'};
  border:1px solid ${p=>p.d==='beginner'?'rgba(34,197,94,0.2)':p.d==='intermediate'?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)'};
  color:${p=>p.d==='beginner'?'#22c55e':p.d==='intermediate'?'#f59e0b':'#ef4444'};
`;
const RatingBadge = styled.span`
  font-size:0.78rem;font-weight:800;padding:3px 10px;border-radius:10px;
  background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);color:#f59e0b;
`;
const PostTitle = styled.h2`font-size:1.15rem;font-weight:700;color:#fef3c7;margin-bottom:10px;cursor:pointer;&:hover{color:#f59e0b;}`;
const PostBody = styled.div`
  color:#b8a07a;font-size:0.9rem;line-height:1.7;margin-bottom:10px;
  img{max-width:100%;border-radius:8px;margin:8px 0;}
  p{margin-bottom:8px;}
  h1,h2,h3{color:#fef3c7;margin:12px 0 6px;}
  ul,ol{padding-left:20px;}
`;
const ViewCount = styled.span`font-size:0.72rem;color:#6b5a3e;display:flex;align-items:center;gap:3px;`;
const Divider = styled.hr`border:none;border-top:1px solid rgba(245,158,11,0.08);margin:14px 0;`;
const CardFooter = styled.div`display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;`;
const Reactions = styled.div`display:flex;gap:6px;`;
const RBtn = styled.button`
  display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:16px;font-size:0.78rem;font-weight:600;
  border:1px solid ${p=>p.$a?'#f59e0b':'rgba(245,158,11,0.12)'};
  background:${p=>p.$a?'rgba(245,158,11,0.12)':'transparent'};
  color:${p=>p.$a?'#f59e0b':'#6b5a3e'};cursor:pointer;transition:all 0.15s;
  &:hover{border-color:#f59e0b;color:#f59e0b;}
`;
const Actions = styled.div`display:flex;gap:6px;`;
const ABtn = styled.button`
  display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:8px;
  border:1px solid rgba(245,158,11,0.15);background:transparent;
  color:#6b5a3e;font-size:0.78rem;cursor:pointer;transition:all 0.15s;
  &:hover{color:${p=>p.$d?'#ef4444':'#fef3c7'};border-color:${p=>p.$d?'#ef4444':'#f59e0b'};}
`;
const ToggleComment = styled.button`
  background:transparent;border:none;color:#6b5a3e;font-size:0.78rem;cursor:pointer;
  display:flex;align-items:center;gap:5px;padding:4px 0;transition:all 0.15s;
  &:hover{color:#f59e0b;}
`;
const Pagination = styled.div`display:flex;justify-content:center;gap:8px;margin-top:24px;`;
const PageBtn = styled.button`
  width:36px;height:36px;border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;
  border:1px solid ${p=>p.$a?'#f59e0b':'rgba(245,158,11,0.15)'};
  background:${p=>p.$a?'rgba(245,158,11,0.2)':'transparent'};
  color:${p=>p.$a?'#f59e0b':'#b8a07a'};transition:all 0.15s;
  &:hover{border-color:#f59e0b;color:#f59e0b;}
`;
const Empty = styled.div`text-align:center;padding:48px;color:#6b5a3e;font-size:0.95rem;`;

const CAT_LABELS = {all:'All',building:'🏗️ Building',construction:'🚧 Construction','it-dev':'💻 IT & Dev',hobbies:'🎨 Hobbies','home-improvement':'🏠 Home',other:'🔧 Other'};
const REACTIONS = [{key:'like',icon:'👍'},{key:'love',icon:'❤️'},{key:'laugh',icon:'😄'},{key:'angry',icon:'😤'}];

const PostList = ({ user, externalPosts, activeCategory, onCategoryChange }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [sort, setSort] = useState('newest');
  const perPage = 6;

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'all') params.append('category', activeCategory);
    if (sort === 'rating') params.append('sort', 'rating');
    if (sort === 'popular') params.append('sort', 'popular');
    api.get(`/api/posts?${params.toString()}`)
      .then(r => { setPosts(r.data); setPage(1); })
      .catch(err => console.error(err));
  }, [activeCategory, sort]);

  useEffect(() => {
    if (externalPosts?.length > 0) {
      setPosts(prev => {
        const ids = new Set(prev.map(p=>p._id));
        return [...externalPosts.filter(p=>!ids.has(p._id)), ...prev];
      });
    }
  }, [externalPosts]);

  const handleReact = async (postId, reaction) => {
    if (!user) return;
    try {
      const res = await api.post(`/api/posts/${postId}/react`, { reaction });
      setPosts(posts.map(p=>p._id===postId?{...p,reactions:res.data.reactions}:p));
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p=>p._id!==postId));
    } catch(e) { console.error(e); }
  };

  const handleRated = (postId, data) => {
    setPosts(posts.map(p=>p._id===postId?{...p,avgRating:data.avgRating,'ratings':[...p.ratings||[]]}:p));
  };

  const toggleComments = (id) => setOpenComments(prev=>({...prev,[id]:!prev[id]}));
  const countR = (post, r) => post.reactions?.filter(x=>x===r).length || 0;

  const total = Math.ceil(posts.length / perPage);
  const current = posts.slice((page-1)*perPage, page*perPage);

  return (
    <Section>
      <Controls>
        <FiFilter size={14} style={{color:'#6b5a3e'}} />
        {Object.keys(CAT_LABELS).map(k=>(
          <FilterBtn key={k} $active={activeCategory===k} onClick={()=>{onCategoryChange(k);setPage(1);}}>
            {CAT_LABELS[k]}
          </FilterBtn>
        ))}
        <SortSelect value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="popular">Most viewed</option>
        </SortSelect>
      </Controls>
      <SectionTitle>Community Projects</SectionTitle>
      {current.length===0 ? <Empty>No projects found. Try a different filter or be the first to post!</Empty>
        : current.map(post=>(
        <Card key={post._id}>
          <CardHeader>
            <Meta>
              <Avatar username={post.username} />
              <TimeStamp><FiClock size={11}/>{new Date(post.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</TimeStamp>
              {post.category && <CatBadge>{CAT_LABELS[post.category]||post.category}</CatBadge>}
              {post.difficulty && <DiffBadge d={post.difficulty}>{post.difficulty}</DiffBadge>}
            </Meta>
            <Meta>
              {post.avgRating>0 && <RatingBadge>⭐ {post.avgRating}/100</RatingBadge>}
              <ViewCount><FiEye size={11}/>{post.viewCount||0}</ViewCount>
            </Meta>
          </CardHeader>

          <PostTitle>{post.title}</PostTitle>
          {post.description && <PostBody dangerouslySetInnerHTML={{__html:sanitizeHtml(post.description)}} />}
          {post.instructions && <><Divider/><PostBody dangerouslySetInnerHTML={{__html:sanitizeHtml(post.instructions)}} /></>}

          {user && (
            <div style={{margin:'14px 0'}}>
              <RatingWidget
                postId={post._id}
                avgRating={post.avgRating}
                totalRatings={post.ratings?.length||0}
                onRated={data=>handleRated(post._id,data)}
              />
            </div>
          )}

          <Divider />

          <CardFooter>
            <Reactions>
              {REACTIONS.map(({key,icon})=>(
                <RBtn key={key} $a={post.reactions?.includes(key)} onClick={()=>handleReact(post._id,key)}>
                  {icon} {countR(post,key)||''}
                </RBtn>
              ))}
            </Reactions>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <ToggleComment onClick={()=>toggleComments(post._id)}>
                💬 {openComments[post._id]?'Hide':'Comments'}
              </ToggleComment>
              {(user?.username===post.username||user?.role==='admin')&&(
                <Actions>
                  <ABtn onClick={()=>setEditId(post._id)}><FiEdit2 size={12}/>Edit</ABtn>
                  <ABtn $d onClick={()=>handleDelete(post._id)}><FiTrash2 size={12}/>Delete</ABtn>
                </Actions>
              )}
            </div>
          </CardFooter>

          {openComments[post._id] && (
            <><Divider/><CommentSection postId={post._id} user={user} /></>
          )}
        </Card>
      ))}
      {total>1&&<Pagination>{Array.from({length:total},(_,i)=>(
        <PageBtn key={i} $a={page===i+1} onClick={()=>setPage(i+1)}>{i+1}</PageBtn>
      ))}</Pagination>}
      {editId&&<EditModal postId={editId} currentUser={user} onClose={()=>setEditId(null)} onPostUpdate={u=>setPosts(posts.map(p=>p._id===u._id?u:p))} />}
    </Section>
  );
};
export default PostList;
