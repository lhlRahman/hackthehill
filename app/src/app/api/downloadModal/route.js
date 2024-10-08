// src/app/api/downloadModal/route.js
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

export async function POST(req) {
  try {
    const { url } = await req.json()

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/octet-stream')) {
      throw new Error(`Unexpected content type: ${contentType}`)
    }

    const fileName = `model-${Date.now()}.glb`
    const filePath = path.join(process.cwd(), 'public', 'models', fileName)

    // Ensure the directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    await streamPipeline(response.body, fs.createWriteStream(filePath))

    return new Response(JSON.stringify({ success: true, fileName: `models/${fileName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Download error:', error)
    return new Response(JSON.stringify({ error: 'Failed to download the model', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}