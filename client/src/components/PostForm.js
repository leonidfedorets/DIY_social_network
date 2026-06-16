import React, { useState } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiUpload, FiSend, FiX } from 'react-icons/fi';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import api from '../utils/api';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const Wrapper = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  margin-bottom: 32px;
  transition: var(--transition);

  &:hover {
    border-color: rgba(124, 58, 237, 0.25);
    box-shadow: 0 0 30px rgba(124, 58, 237, 0.05);
  }
`;

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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  margin-bottom: 14px;
  transition: var(--transition);

  &::placeholder { color: var(--text-muted); }
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.05);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const EditorWrapper = styled.div`
  margin-bottom: 14px;
`;

const FileArea = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: var(--transition);
  margin-bottom: 14px;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.05);
  }

  input { display: none; }
`;

const Preview = styled.div`
  position: relative;
  margin-bottom: 14px;
  border-radius: var(--radius-sm);
  overflow: hidden;

  img, video {
    max-width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
`;

const RemovePreview = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  border: none;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover { background: var(--danger); }
`;

const ProgressBar = styled.div`
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin-bottom: 14px;
  overflow: hidden;
  display: ${p => p.$show ? 'block' : 'none'};

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${p => p.$value}%;
    background: linear-gradient(90deg, #7c3aed, #3b82f6);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
`;

const SubmitBtn = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const GuestPrompt = styled.div`
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
  font-size: 0.9rem;

  span {
    color: var(--accent-primary);
    font-weight: 600;
  }
`;

const PostForm = ({ username, onPostSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!username) {
    return (
      <Wrapper>
        <GuestPrompt>
          <span>Sign in</span> to share your DIY project with the community
        </GuestPrompt>
      </Wrapper>
    );
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!instructions) {
      toast('Instructions are required', { theme: 'dark', className: 'error-toast' });
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('instructions', instructions);
    if (file) formData.append('file', file);

    setSubmitting(true);
    try {
      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setTitle('');
      setDescription('');
      setInstructions('');
      setFile(null);
      setFilePreview(null);
      setUploadProgress(0);
      onPostSubmit(response.data);
      toast('Post published!', { theme: 'dark', className: 'success-toast' });
    } catch {
      toast('Failed to publish post', { theme: 'dark', className: 'error-toast' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <SectionTitle>Share a Project</SectionTitle>
      <form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input
          type="text"
          placeholder="Give your project a catchy title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <Label>Description</Label>
        <EditorWrapper>
          <ReactQuill
            placeholder="What's your project about?"
            value={description}
            onChange={setDescription}
            modules={QUILL_MODULES}
          />
        </EditorWrapper>

        <Label>Instructions *</Label>
        <EditorWrapper>
          <ReactQuill
            placeholder="Step-by-step instructions..."
            value={instructions}
            onChange={setInstructions}
            modules={QUILL_MODULES}
          />
        </EditorWrapper>

        <FileArea>
          <FiUpload />
          {file ? file.name : 'Attach a photo or video (JPEG, PNG, MP4 · max 5MB)'}
          <input type="file" accept="image/jpeg,image/png,video/mp4" onChange={handleFileChange} />
        </FileArea>

        {filePreview && (
          <Preview>
            {file?.type?.startsWith('video') ? (
              <video src={filePreview} controls />
            ) : (
              <img src={filePreview} alt="preview" />
            )}
            <RemovePreview type="button" onClick={() => { setFile(null); setFilePreview(null); }}>
              <FiX size={14} />
            </RemovePreview>
          </Preview>
        )}

        <ProgressBar $show={uploadProgress > 0 && uploadProgress < 100} $value={uploadProgress} />

        <SubmitBtn type="submit" disabled={submitting}>
          <FiSend /> {submitting ? 'Publishing...' : 'Publish Project'}
        </SubmitBtn>
      </form>
    </Wrapper>
  );
};

export default PostForm;
