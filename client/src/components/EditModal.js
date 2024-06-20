import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';


const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 5px;
  border: none;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  margin: 5px;
`;

const EditModal = ({ postId, onClose, currentUser, onPostUpdate }) => {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPost(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setInstructions(response.data.instructions);
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        
      }
    };

    fetchPost();
  }, [postId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleInstructionsChange = (value) => {
    setInstructions(value);
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:4000/api/posts/${postId}`,
        {
          title,
          description,
          instructions,
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Post updated successfully:', response.data);

      console.success('Post updated successfully!');

      onPostUpdate(response.data); // Call onPostUpdate with the updated post data
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <Input type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
          <RichText
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <RichText
            placeholder="Instructions"
            value={instructions}
            onChange={handleInstructionsChange}
          />
          <PreviewImagesContainer>
            {images.map((image, index) => (
              <ImageContainer key={index}>
                <img src={`http://localhost:4000/uploads/${image}`} alt="" />
                {currentUser && currentUser.username === post.username && (
                  <DeleteImageButton onClick={() => handleImageDelete(index)}>
                    <FaTimes />
                  </DeleteImageButton>
                )}
              </ImageContainer>
            ))}
          </PreviewImagesContainer>
          <ButtonContainer>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <Button type="submit">Save Changes</Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
`;

const RichText = styled(ReactQuill)`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  min-height: 150px;
  width: 100%;
`;

const PreviewImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DeleteImageButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d9363e;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
`;

export default EditModal;

