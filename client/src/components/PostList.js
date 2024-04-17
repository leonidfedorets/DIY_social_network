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

const Timestamp = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-top: 5px;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Function to fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // Call fetchPosts when the component mounts and after a new post is submitted
    fetchPosts();
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Function to format the timestamp into a human-readable format
  const formatTimestamp = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h2>Posts</h2>
      <List>
        {posts.map((post) => (
          <ListItem key={post._id}>
            <Avatar username={post.username} /> {/* Use the Avatar component with username */}
            <div>
              <h3>{post.title}</h3>
              {/* Render the description and instructions as HTML */}
              <p dangerouslySetInnerHTML={{ __html: post.description }} />
              <p dangerouslySetInnerHTML={{ __html: post.instructions }} />
              {/* Display the styled timestamp */}
              <Timestamp>Posted on: {formatTimestamp(post.createdAt)}</Timestamp>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PostList;
