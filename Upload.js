import React, { useState } from 'react';

export default function Upload() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setAnalysis(data.analysis || data);
    } catch (err) {
      setAnalysis({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Resume Analyzer</h1>
      <div className="border-2 border-dashed p-6 rounded mb-4">
        <input type="file" accept=".pdf,.docx" onChange={handleUpload} />
        <p className="text-sm text-gray-500 mt-2">Upload PDF or DOCX resume</p>
      </div>

      {loading && <p className="text-blue-600">Analyzing {fileName} ...</p>}

      {analysis && (
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Analysis</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
