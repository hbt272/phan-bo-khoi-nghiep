import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import TimelineTable from './TimelineTable';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success:', response.data);
      setData(response.data.data);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.response?.data || 'Failed to upload and process file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Timeline Scheduler - Excel Import
      </Typography>

      <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" component="label">
          Select Excel File
          <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload and Process'}
        </Button>
        {file && <Typography variant="body1">Selected: {file.name}</Typography>}
      </Box>

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {data.length > 0 && <TimelineTable data={data} />}
    </Container>
  );
}

export default App;
