import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiX, FiSave } from 'react-icons/fi';
import api from '../utils/api';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 32px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 32px 80px rgba(0,0,0,0.7);
  animation: ${slideUp} 0.25s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px;
`;

const Title = styled.h2`font-size: 1.3rem; font-weight: 700; color: var(--text-primary);`;

const CloseBtn = styled.button`
  background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary);
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);
  &:hover { color: var(--text-primary); border-color: var(--danger); background: rgba(239,68,68,0.1); }
`;

const Label = styled.label`
  display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%; padding: 12px 16px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.95rem;
  margin-bottom: 16px; transition: var(--transition);
  &::placeholder { color: var(--text-muted); }
  &:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
`;

const EditorWrapper = styled.div`margin-bottom: 16px;`;

const BtnRow = styled.div`display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;`;

const Btn = styled.button`
  padding: 10px 20px; border-radius: var(--radius-sm); border: 1px solid var(--border);
  cursor: pointer; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 7px;
  transition: var(--transition);
`;

const CancelBtn = styled(Btn)`
  background: transparent; color: var(--text-secondary);
  &:hover { color: var(--text-primary); border-color: var(--text-secondary); }
`;

const SaveBtn = styled(Btn)`
  background: linear-gradient(135deg, #7c3aed, #3b82f6); border: none; color: white;
  &:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.4); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const QUILL_MODULES = {
  toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
};

const EditModal = ({ postId, onClose, currentUser, onPostUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${postId}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setInstructions(response.data.instructions);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put(`/api/posts/${postId}`, { title, description, instructions });
      onPostUpdate(response.data);
      onClose();
    } catch (err) {
      console.error('Error updating post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>Edit Project</Title>
          <CloseBtn onClick={onClose}><FiX /></CloseBtn>
        </Header>
        <form onSubmit={handleSubmit}>
          <Label>Title</Label>
          <Input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" />

          <Label>Description</Label>
          <EditorWrapper>
            <ReactQuill value={description} onChange={setDescription} modules={QUILL_MODULES} placeholder="Description..." />
          </EditorWrapper>

          <Label>Instructions</Label>
          <EditorWrapper>
            <ReactQuill value={instructions} onChange={setInstructions} modules={QUILL_MODULES} placeholder="Instructions..." />
          </EditorWrapper>

          <BtnRow>
            <CancelBtn type="button" onClick={onClose}><FiX /> Cancel</CancelBtn>
            <SaveBtn type="submit" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save Changes'}</SaveBtn>
          </BtnRow>
        </form>
      </Modal>
    </Overlay>
  );
};

export default EditModal;
