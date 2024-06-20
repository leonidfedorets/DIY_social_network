import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 750px;
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/users/update-role/${userId}`, { role: newRole });
      console.log('Role updated successfully:', response.data);
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <TableContainer>
      <h2>Users</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>User ID</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Created Date</TableHeader>
            <TableHeader>Role</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <TableData>{user._id}</TableData>
              <TableData>{user.username}</TableData>
              <TableData>{new Date(user.createdAt).toLocaleString()}</TableData>
              <TableData>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default Users;

