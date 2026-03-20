'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      setProcessedBlob(null);
      setError(null);
      uploadFile(file);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'YKWuLgGq1CL3uBKAwmFm6Adg',
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.errors?.[0]?.title || '处理失败');
      }

      const blob = await response.blob();
      setProcessedBlob(blob);
      setProcessedImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedBlob) {
      const url = URL.createObjectURL(processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'removed-background.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-3">
          🖼️ AI 背景移除
        </h1>
        <p className="text-center text-gray-600 mb-8">
          上传图片，AI 自动移除背景
        </p>

        {/* Upload Area */}
        <div
          ref={uploadAreaRef}
          className="border-2 border-dashed border-indigo-500 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 bg-indigo-50 hover:bg-indigo-100 hover:border-purple-600"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            uploadAreaRef.current?.classList.add('bg-indigo-200', 'border-purple-600');
          }}
          onDragLeave={() => {
            uploadAreaRef.current?.classList.remove('bg-indigo-200', 'border-purple-600');
          }}
          onDrop={(e) => {
            e.preventDefault();
            uploadAreaRef.current?.classList.remove('bg-indigo-200', 'border-purple-600');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleFile(files[0]);
            }
          }}
        >
          <div className="text-5xl mb-4">📁</div>
          <div className="text-indigo-600 text-lg font-medium">
            点击或拖拽图片到这里
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Preview */}
        {(originalImage || processedImage) && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {originalImage && (
                <div className="text-center">
                  <div className="text-gray-600 mb-3 font-medium">原图</div>
                  <img
                    src={originalImage}
                    alt="原图"
                    className="max-w-full rounded-xl shadow-md"
                    style={{
                      background: 'repeating-conic-gradient(#e0e0e0 0% 25%, white 0% 50%) 50% / 20px 20px'
                    }}
                  />
                </div>
              )}
              {processedImage && (
                <div className="text-center">
                  <div className="text-gray-600 mb-3 font-medium">处理后</div>
                  <img
                    src={processedImage}
                    alt="处理后"
                    className="max-w-full rounded-xl shadow-md"
                    style={{
                      background: 'repeating-conic-gradient(#e0e0e0 0% 25%, white 0% 50%) 50% / 20px 20px'
                    }}
                  />
                </div>
              )}
            </div>
            {processedImage && (
              <button
                onClick={handleDownload}
                className="w-full py-3 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                下载图片
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center mt-5 text-indigo-600">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-indigo-500 mx-auto mb-4"></div>
            <p>正在处理中...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center mt-5 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
