import React, { useState } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiUpload, FiSend, FiX } from 'react-icons/fi';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import api from '../utils/api';

const QUILL_MODULES = { toolbar: [[{header:[1,2,false]}],['bold','italic','underline'],[{list:'ordered'},{list:'bullet'}],['link'],['clean']] };

const Wrap = styled.div`
  background:rgba(255,248,220,0.03);border:1px solid rgba(245,158,11,0.15);
  border-radius:16px;padding:28px;margin-bottom:28px;transition:all 0.2s;
  &:hover{border-color:rgba(245,158,11,0.3);}
`;
const Ttl = styled.h3`
  font-size:1.05rem;font-weight:700;color:#fef3c7;margin-bottom:20px;
  display:flex;align-items:center;gap:8px;
  &::before{content:'';display:block;width:4px;height:20px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:2px;}
`;
const Label = styled.label`display:block;font-size:0.78rem;font-weight:700;color:#b8a07a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;`;
const Input = styled.input`
  width:100%;padding:12px 16px;background:rgba(255,248,220,0.04);
  border:1px solid rgba(245,158,11,0.15);border-radius:8px;
  color:#fef3c7;font-size:0.95rem;margin-bottom:14px;transition:all 0.2s;
  &::placeholder{color:#6b5a3e;}
  &:focus{outline:none;border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.1);}
`;
const Select = styled.select`
  padding:11px 16px;background:rgba(255,248,220,0.04);
  border:1px solid rgba(245,158,11,0.15);border-radius:8px;
  color:#fef3c7;font-size:0.9rem;cursor:pointer;margin-bottom:14px;transition:all 0.2s;
  &:focus{outline:none;border-color:#f59e0b;}
  option{background:#161310;color:#fef3c7;}
`;
const Row = styled.div`display:flex;gap:12px;>*{flex:1;}@media(max-width:600px){flex-direction:column;}`;
const EditorWrap = styled.div`margin-bottom:14px;`;
const FileArea = styled.label`
  display:flex;align-items:center;gap:10px;padding:12px 16px;
  background:rgba(255,248,220,0.02);border:1px dashed rgba(245,158,11,0.2);
  border-radius:8px;cursor:pointer;color:#b8a07a;font-size:0.875rem;
  transition:all 0.2s;margin-bottom:14px;
  &:hover{border-color:#f59e0b;color:#f59e0b;}
  input{display:none;}
`;
const Preview = styled.div`position:relative;margin-bottom:14px;border-radius:8px;overflow:hidden;
  img,video{max-width:100%;max-height:200px;object-fit:cover;border-radius:8px;}`;
const RemBtn = styled.button`
  position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.7);border:none;color:white;
  border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;
  &:hover{background:#ef4444;}
`;
const SubmitBtn = styled.button`
  padding:11px 26px;background:linear-gradient(135deg,#f59e0b,#d97706);
  border:none;border-radius:8px;color:#0e0c0a;font-size:0.9rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.2s;
  &:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(245,158,11,0.4);}
  &:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
`;
const Guest = styled.div`text-align:center;padding:20px;color:#6b5a3e;font-size:0.95rem;
  span{color:#f59e0b;font-weight:700;}`;

const PostForm = ({ username, onPostSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('other');
  const [difficulty, setDifficulty] = useState('beginner');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!username) return (
    <Wrap><Guest><span>Sign in</span> to share your DIY project with the community</Guest></Wrap>
  );

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!instructions) { toast('Instructions are required', { theme:'dark', className:'error-toast' }); return; }
    const fd = new FormData();
    fd.append('username', username);
    fd.append('title', title);
    fd.append('description', description);
    fd.append('instructions', instructions);
    fd.append('category', category);
    fd.append('difficulty', difficulty);
    if (file) fd.append('file', file);
    setSubmitting(true);
    try {
      const res = await api.post('/api/posts', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setTitle(''); setDescription(''); setInstructions('');
      setCategory('other'); setDifficulty('beginner');
      setFile(null); setPreview(null);
      onPostSubmit(res.data);
      toast('Project published! 🔨', { theme:'dark', className:'success-toast' });
    } catch { toast('Failed to publish', { theme:'dark', className:'error-toast' }); }
    finally { setSubmitting(false); }
  };

  return (
    <Wrap>
      <Ttl>Share a Project</Ttl>
      <form onSubmit={onSubmit}>
        <Label>Title *</Label>
        <Input type="text" placeholder="Give your project a clear title..." value={title} onChange={e=>setTitle(e.target.value)} required />
        <Row>
          <div>
            <Label>Category</Label>
            <Select value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="building">🏗️ Building</option>
              <option value="construction">🚧 Construction</option>
              <option value="it-dev">💻 IT & Dev</option>
              <option value="hobbies">🎨 Hobbies</option>
              <option value="home-improvement">🏠 Home Improvement</option>
              <option value="other">🔧 Other</option>
            </Select>
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
              <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
            </Select>
          </div>
        </Row>
        <Label>Description</Label>
        <EditorWrap>
          <ReactQuill placeholder="What is this project about?" value={description} onChange={setDescription} modules={QUILL_MODULES} />
        </EditorWrap>
        <Label>Step-by-Step Instructions *</Label>
        <EditorWrap>
          <ReactQuill placeholder="Explain how to do it, step by step..." value={instructions} onChange={setInstructions} modules={QUILL_MODULES} />
        </EditorWrap>
        <FileArea>
          <FiUpload /> {file ? file.name : 'Attach photo or video (JPEG, PNG, MP4 · max 10MB)'}
          <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" onChange={onFile} />
        </FileArea>
        {preview && (
          <Preview>
            {file?.type?.startsWith('video') ? <video src={preview} controls /> : <img src={preview} alt="preview" />}
            <RemBtn type="button" onClick={()=>{setFile(null);setPreview(null);}}><FiX size={13}/></RemBtn>
          </Preview>
        )}
        <SubmitBtn type="submit" disabled={submitting}><FiSend />{submitting?'Publishing...':'Publish Project'}</SubmitBtn>
      </form>
    </Wrap>
  );
};
export default PostForm;
