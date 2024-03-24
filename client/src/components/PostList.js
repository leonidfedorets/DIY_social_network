import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Avatar from './Avatar'; // Import the Avatar component

const List = styled.ul`
  margin-top: 20px;
`;

const ListItem = styled.li`
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  margin-bottom: 10px;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the backend when the component mounts
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

  return (
    <div>
      <h2>Posts</h2>
      <List>
        {posts.map((post) => (
          <ListItem key={post._id}>
            <Avatar username={post.username} /> {/* Use the Avatar component with username */}
            <div>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p>{post.instructions}</p>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PostList;
