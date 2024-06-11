// src/components/GitHubLogin.js
import React from 'react';

const GitHubLogin = () => {
  return (
    <a href="https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID">
      <button>Login with GitHub</button>
    </a>
  );
};

export default GitHubLogin;