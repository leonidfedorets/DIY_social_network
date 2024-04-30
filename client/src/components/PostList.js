import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaRegThumbsUp, FaRegHeart, FaRegLaugh, FaRegAngry } from 'react-icons/fa';
import Avatar from './Avatar';
import EditModal from './EditModal'; // Import the EditModal component

const List = styled.ul`
  margin-top: 20px;
`;

const ListItem = styled.li`
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  width: 1000px;
`;

const PostText = styled.div`
  margin-left: 10px;
`;

const PostTitle = styled.h3`
  margin: 0;
`;

const PostDescription = styled.div`
  margin: 5px 0;
  img {
    max-width: 100%;
    height: auto;
  }
`;

const ReactionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 200px; /* Fixed width for reactions container */
`;

const ReactionButton = styled.button`
  background-color: ${(props) => (props.selected ? '#007bff' : '#f9f9f9')};
  color: ${(props) => (props.selected ? 'white' : '#007bff')};
  border: 1px solid #007bff;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px; /* Fixed width for reaction button */
  height: 30px; /* Fixed height for reaction button */
  margin-left: 5px;
`;

const ReactionCounter = styled.span`
  font-size: 14px;
  color: #666;
  margin-left: 5px;
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #999;
`;
const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
`;
const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px; 
  border-radius: 5px;
  cursor: pointer;
  height:35px;
  width:60px;
  display:flex;
  margin: 5px
`;

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editPostId, setEditPostId] = useState(null); // Track the post id for editing
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleReaction = async (postId, reaction) => {
    try {
      const username = user && user.username;
      const response = await axios.post(`http://localhost:4000/api/posts/${postId}/react`, {
        reaction,
        user: username,
      });
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            reactions: response.data.reactions,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const getReactionCount = (postId, reaction) => {
    const post = posts.find((post) => post._id === postId);
    return post ? (post.reactions ? post.reactions.filter((r) => r === reaction).length : 0) : 0;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (postId) => {
    setEditPostId(postId); // Set the post id for editing
  };

  const handleCloseEditModal = () => {
    setEditPostId(null); // Reset the edit post id
  };

  const handlePostUpdate = (updatedPost) => {
    // Update the post in the state
    setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  return (
    <div>
      <h2>Posts</h2>
      <List>
        {currentPosts.map((post) => (
          <ListItem key={post._id}>
            <AvatarContainer>
              <Avatar username={post.username} />
            </AvatarContainer>
            <PostContent>
           
              <PostHeader>
                <PostText>
                  <PostTitle>{post.title}</PostTitle>
                  <PostDescription dangerouslySetInnerHTML={{ __html: post.description }} />
                  <PostDescription dangerouslySetInnerHTML={{ __html: post.instructions }} />
                </PostText>
              </PostHeader>
              <EditButton onClick={() => handleEditClick(post._id)}>Edit</EditButton> {/* Add this line */}
              <TimeStamp>Posted on: {new Date(post.createdAt).toLocaleString()}</TimeStamp>
            </PostContent>
            <ReactionsContainer>
              <ReactionButton
                selected={post.reactions && post.reactions.includes('like')}
                onClick={() => handleReaction(post._id, 'like')}
              >
                <FaRegThumbsUp />
                <ReactionCounter>{getReactionCount(post._id, 'like')}</ReactionCounter>
              </ReactionButton>
              <ReactionButton
                selected={post.reactions && post.reactions.includes('love')}
                onClick={() => handleReaction(post._id, 'love')}
              >
                <FaRegHeart />
                <ReactionCounter>{getReactionCount(post._id, 'love')}</ReactionCounter>
              </ReactionButton>
              <ReactionButton
                selected={post.reactions && post.reactions.includes('laugh')}
                onClick={() => handleReaction(post._id, 'laugh')}
              >
                <FaRegLaugh />
                <ReactionCounter>{getReactionCount(post._id, 'laugh')}</ReactionCounter>
              </ReactionButton>
              <ReactionButton
                selected={post.reactions && post.reactions.includes('angry')}
                onClick={() => handleReaction(post._id, 'angry')}
              >
                <FaRegAngry />
                <ReactionCounter>{getReactionCount(post._id, 'angry')}</ReactionCounter>
              </ReactionButton>
            </ReactionsContainer>
           
          </ListItem>
        ))}
      </List>
      <PaginationContainer>
        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
          <PaginationButton key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>
      {editPostId && (
        <EditModal postId={editPostId} onClose={handleCloseEditModal} onPostUpdate={handlePostUpdate} /> // Render EditModal if editPostId is set
      )}
    </div>
  );
};

export default PostList;
