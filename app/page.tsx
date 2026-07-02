'use client';

import { useRouter } from 'next/navigation';
import GiftForm from '@/components/GiftForm';
import { GiftFormData } from '@/types';
import { getHistory } from '@/lib/history';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (data: GiftFormData) => {
    const history = getHistory(data.name.trim());
    sessionStorage.setItem('gifty_form', JSON.stringify(data));
    sessionStorage.setItem('gifty_history', JSON.stringify(history));
    router.push(`/result?t=${Date.now()}`);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F5] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="relative text-center mb-10">
          <h1 className="text-3xl font-bold text-[#FF6B6B] mb-2">GIFTY</h1>
          <p className="text-sm text-gray-500">AI가 찾아주는 맞춤 선물 추천</p>
          <button
            onClick={() => router.push('/settings')}
            className="absolute top-0 right-0 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            이력 관리
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <GiftForm onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
