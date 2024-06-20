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

const RoleSelect = styled.select`
  padding: 5px;
`;

const Checkbox = styled.input`
  margin: 0 5px;
`;



const Backoffice = ({ user }) => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users' );
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:4000/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      console.success('Role updated successfully');
    } catch (error) {
      console.error('Error updating user role' );
    }
  };

  const handlePermissionChange = async (userId, permission, value) => {
    try {
      const updatedPermissions = { ...users.find(user => user._id === userId).permissions, [permission]: value };
      await axios.put(`http://localhost:4000/api/users/${userId}/permissions`, { permissions: updatedPermissions });
      setUsers(users.map(user => user._id === userId ? { ...user, permissions: updatedPermissions } : user));
      console.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating user permissions');
    }
  };

  return (
    <TableContainer>
      <h2>Backoffice</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>User ID</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Permissions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <TableData>{user._id}</TableData>
              <TableData>{user.username}</TableData>
              <TableData>
                <RoleSelect value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </RoleSelect>
              </TableData>
              <TableData>
                {['create', 'read', 'update', 'delete'].map(permission => (
                  <label key={permission}>
                    <Checkbox
                      type="checkbox"
                      checked={user.permissions?.[permission] || false}
                      onChange={(e) => handlePermissionChange(user._id, permission, e.target.checked)}
                    />
                    {permission}
                  </label>
                ))}
              </TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default Backoffice;
