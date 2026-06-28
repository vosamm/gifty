'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GiftFormData, GiftRecommendation } from '@/types';
import GiftCard from '@/components/GiftCard';
import LoadingDots from '@/components/LoadingDots';

function extractJson(text: string): string | null {
  // Try to extract from ```json ... ``` code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try to extract raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];

  return null;
}

export default function ResultPage() {
  const router = useRouter();
  const [gifts, setGifts] = useState<GiftRecommendation[]>([]);
  const [personName, setPersonName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<GiftFormData | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);

  const fetchRecommendations = async (data: GiftFormData, excludedGifts: string[]) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, history: excludedGifts }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const jsonStr = extractJson(fullText);
      if (!jsonStr) throw new Error('JSON을 찾을 수 없습니다');

      const parsed = JSON.parse(jsonStr);
      if (parsed.error) throw new Error(parsed.error);

      setGifts(parsed.gifts || []);
    } catch (err) {
      console.error('Recommendation error:', err);
      setError('추천을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formRaw = sessionStorage.getItem('gifty_form');
    const historyRaw = sessionStorage.getItem('gifty_history');

    if (!formRaw) {
      router.push('/');
      return;
    }

    const data: GiftFormData = JSON.parse(formRaw);
    const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];

    setPersonName(data.name);
    setFormData(data);
    setExcluded(history);
    fetchRecommendations(data, history);
  }, [router]);

  const handleRecommendAgain = () => {
    if (!formData) return;
    const newExcluded = [...excluded, ...gifts.map((g) => g.name)];
    setExcluded(newExcluded);
    fetchRecommendations(formData, newExcluded);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F5] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF6B6B] mb-2">GIFTY</h1>
          {!loading && gifts.length > 0 && (
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{personName}</span>을(를) 위한 맞춤 선물 추천
            </p>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 flex flex-col items-center gap-4">
            <LoadingDots />
            <p className="text-sm text-gray-500 text-center">
              AI가 최적의 선물을 찾고 있어요...
              <br />
              <span className="text-xs text-gray-400">웹 검색으로 최신 트렌드를 확인 중입니다</span>
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600 text-center">{error}</p>
            <button
              onClick={() => formData && fetchRecommendations(formData, excluded)}
              className="w-full py-3 bg-[#FF6B6B] text-white rounded-xl text-sm font-semibold hover:bg-[#ff5252] transition-colors"
            >
              다시 시도하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        )}

        {/* Success state */}
        {!loading && !error && gifts.length > 0 && (
          <div className="flex flex-col gap-4">
            {gifts.map((gift, index) => (
              <GiftCard
                key={index}
                gift={gift}
                personName={personName}
                index={index}
              />
            ))}

            <button
              onClick={handleRecommendAgain}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-sm bg-[#FF6B6B] text-white hover:bg-[#ff5252] transition-colors"
            >
              다른 선물 추천받기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              처음으로
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
