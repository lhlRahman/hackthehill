// pages/api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    console.error('Proxy error: No URL provided');
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    const buffer = await response.arrayBuffer();
    console.log('Received buffer size:', buffer.byteLength);

    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch the resource', details: error.message });
  }
}