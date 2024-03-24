import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
`;

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users data from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <TableContainer>
      <h2>Users</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>User ID</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Created Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <TableData>{user._id}</TableData>
              <TableData>{user.username}</TableData>
              <TableData>{user.createdAt}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default Users;

