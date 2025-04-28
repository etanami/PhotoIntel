'use client';

import axios from 'axios';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

interface Result {
  image: {
    url: string;
    aiSummary: string;
    location: null;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); 

  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:8000/images/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response', response);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      console.log('result', result);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);

    // Clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  return (
    <div className='max-w-xl mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-4'>Image Uploader Test</h1>

      <input
        type='file'
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className='mb-4'
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className='px-4 py-2 mr-4 bg-blue-600 text-white rounded'
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {file && (
        <button
          onClick={handleReset}
          className='px-4 py-2 bg-red-600 text-white rounded mt-4'
        >
          Reset
        </button>
      )}

      {result && (
        <div className='mt-6 space-y-4'>
          <Image
            src={result.image.url}
            alt='Uploaded Image'
            width={500}
            height={500}
            className='w-full max-h-96 object-contain rounded'
          />
          <div>
            <h2 className='font-semibold'>AI Summary</h2>
            <p className='text-gray-700'>{result.image.aiSummary}</p>
          </div>
          <div>
            <h2 className='font-semibold'>Location</h2>
            <p className='text-gray-700'>
              {result.image.location
                ? result.image.location
                : 'No location found.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
