const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/api/save-user', async (req, res) => {
  const { username, email, password } = req.body;
  const token = 'GITHUB_PERSONAL_ACCESS_TOKEN'; // Ganti dengan token Anda
  const repoOwner = 'GITHUB_USERNAME'; // Ganti dengan username GitHub Anda
  const repoName = 'REPOSITORY_NAME'; // Ganti dengan nama repository
  
  try {
    // 1. Dapatkan informasi file yang sudah ada
    const filePath = 'users.json';
    const getFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    let currentContent = '';
    let sha = null;
    
    try {
      const fileResponse = await axios.get(getFileUrl, {
        headers: { Authorization: `token ${token}` }
      });
      
      currentContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf8');
      sha = fileResponse.data.sha;
    } catch (error) {
      // File belum ada, akan dibuat baru
      console.log('File belum ada, akan dibuat baru');
    }
    
    // 2. Parse data yang sudah ada atau buat array baru
    const users = currentContent ? JSON.parse(currentContent) : [];
    
    // 3. Tambahkan user baru
    users.push({ username, email, password, createdAt: new Date().toISOString() });
    
    // 4. Encode content ke base64
    const newContent = Buffer.from(JSON.stringify(users, null, 2)).toString('base64');
    
    // 5. Commit perubahan ke GitHub
    const updateResponse = await axios.put(getFileUrl, {
      message: `Add user ${username}`,
      content: newContent,
      sha: sha
    }, {
      headers: { Authorization: `token ${token}` }
    });
    
    res.json({ success: true, message: 'User berhasil disimpan ke GitHub' });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Gagal menyimpan user' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
