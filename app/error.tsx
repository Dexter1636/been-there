'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-medium text-stone-800">出错了</h2>
        <p className="text-stone-600">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          重试
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-stone-500">错误详情</summary>
          <pre className="mt-2 text-xs bg-stone-100 p-2 rounded overflow-auto max-w-md">
            {error.stack}
          </pre>
        </details>
      </div>
    </div>
  );
}
