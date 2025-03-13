import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { useTheme } from "./Theme"; // Import the useTheme hook
import "./MainComponent.css";

const MainComponent = () => {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);

  // Fetch user data
  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await fetch("https://api.github.com/users");
        const newData = await response.json();
        setUsers(newData);
      } catch {
        setError("Error in Fetching Data");
      } finally {
        setLoading(false);
      }
    };
    handleData();
  }, []);

  // Dynamically set theme class on body
  useEffect(() => {
    document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  }, [theme]);

  if (loading) {
    return <div>Loading Please wait!....</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.login.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = async (user) => {
    setSelectedUser(user);
    setModalOpen(true);

    const reposResponse = await fetch(user.repos_url);
    const reposData = await reposResponse.json();
    setRepos(reposData);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setRepos([]);
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={toggleTheme}>Toggle Theme</button> {/* Button to toggle theme */}

      <table>
        <caption>Github Login Details</caption>
        <thead>
          <tr>
            <th>Id</th>
            <th>Login Details</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Organization</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, id) => (
            <tr key={id} onClick={() => openModal(user)}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.followers_url}</td>
              <td>{user.following_url}</td>
              <td>{user.organizations_url}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Details Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser?.login}</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <>
              <Typography variant="h6">Bio:</Typography>
              <Typography variant="body1">
                {selectedUser.bio || "No bio available"}
              </Typography>

              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Repositories:
              </Typography>
              {repos.length > 0 ? (
                <ul>
                  {repos.map((repo, index) => (
                    <li key={index}>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">No repositories available</Typography>
              )}
            </>
          ) : (
            <Typography variant="body1">Loading user details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainComponent;
