'use client'

import axios from "axios";
import { useState } from "react";
import Image from "next/image";

interface Result {
  url: string;
  summary: string;
  metadata: object;
}


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if(!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/images/upload', formData);
      console.log(response);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      console.log(result);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
    <h1 className="text-2xl font-bold mb-4">Image Uploader Test</h1>

    <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4" />

    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? 'Uploading...' : 'Upload'}
    </button>

    {result && (
      <div className="mt-6 space-y-4">
        <Image src={result.url} alt="Uploaded Image" width={500} height={500} className="w-full max-h-96 object-contain rounded" />
        <div>
          <h2 className="font-semibold">AI Summary</h2>
          <p className="text-gray-700">{result.summary}</p>
        </div>
        {/* <div>
          <h2 className="font-semibold">Metadata</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(result.metadata, null, 2)}
          </pre>
        </div> */}
      </div>
    )}
  </div>
  )
}
