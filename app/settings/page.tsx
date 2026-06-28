'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllHistory, removeGift, clearHistory } from '@/lib/history';

interface GiftHistory {
  [personName: string]: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [history, setHistory] = useState<GiftHistory>({});

  useEffect(() => {
    setHistory(getAllHistory());
  }, []);

  const handleRemoveGift = (name: string, gift: string) => {
    removeGift(name, gift);
    setHistory(getAllHistory());
  };

  const handleClearPerson = (name: string) => {
    clearHistory(name);
    setHistory(getAllHistory());
  };

  const people = Object.keys(history);

  return (
    <main className="min-h-screen bg-[#FFF9F5] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">선물 이력 관리</h1>
        </div>

        {people.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-gray-400 text-sm">저장된 선물 이력이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {people.map((name) => (
              <div key={name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-800">{name}</h2>
                  <button
                    onClick={() => handleClearPerson(name)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {history[name].map((gift) => (
                    <div key={gift} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{gift}</span>
                      <button
                        onClick={() => handleRemoveGift(name, gift)}
                        className="text-xs text-gray-300 hover:text-red-400 transition-colors ml-2"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
