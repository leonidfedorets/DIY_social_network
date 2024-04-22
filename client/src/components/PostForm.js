import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostForm = ({ username }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null); // Store selected file
  const [filePreview, setFilePreview] = useState(null); // Store file preview
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleInstructionsChange = (value) => {
    setInstructions(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Check if file is a picture or video and set preview accordingly
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setFilePreview(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = 'http://localhost:4000/api/posts';

    const formData = new FormData();
    formData.append('username', username);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('instructions', instructions);
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      },
    };

    try {
      const response = await axios.post(url, formData, config);

      setSuccess(true);
      setUploadedFiles(response.data.uploadedFiles || []);

      // Clear form after successful submission
      setTitle('');
      setDescription('');
      setInstructions('');
      setFile(null);
      setFilePreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to submit post');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <RichText
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'video'], // Include image and video options
              ['clean'],
            ],
          },
        }}
      />
      {filePreview && <FilePreview src={filePreview} alt="File Preview" />}
      <RichText
        placeholder="Instructions"
        value={instructions}
        onChange={handleInstructionsChange}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'video'], // Include image and video options
              ['clean'],
            ],
          },
        }}
      />
      
      <Button type="submit">Submit</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>Post submitted successfully!</SuccessMessage>}
      <Progress value={uploadProgress} max="100" />
      {uploadedFiles.length > 0 && (
        <UploadedFilesContainer>
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </UploadedFilesContainer>
      )}
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
`;

const RichText = styled(ReactQuill)`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  min-height: 150px;
`;

const FilePreview = styled.img`
  max-width: 100%;
  margin-bottom: 10px;
`;

const FileUploadLabel = styled.label`
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
  width: fit-content;
  transition: background-color 0.3s;
  text-align: center;
`;

const FileUploadInput = styled.input`
  display: none;
`;

const Button = styled.button`
  padding: 8px 16px;
  display:block;
  margin:auto;
  width:200px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  
`;

const ErrorMessage = styled.p`
  color: red;
`;

const SuccessMessage = styled.p`
  color: green;
`;

const Progress = styled.progress`
  margin-top: 10px;
  width: 100%;
`;

const UploadedFilesContainer = styled.div`
  margin-top: 20px;
  h3 {
    margin-bottom: 10px;
  }
`;

export default PostForm;
