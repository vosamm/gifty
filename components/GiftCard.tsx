'use client';

import { GiftRecommendation } from '@/types';
import { getNaverShoppingUrl, getCoupangUrl, getKakaoGiftUrl } from '@/lib/shopping';
import { saveGift, removeGift } from '@/lib/history';
import { useState } from 'react';

interface GiftCardProps {
  gift: GiftRecommendation;
  personName: string;
  index: number;
}

export default function GiftCard({ gift, personName, index }: GiftCardProps) {
  const [saved, setSaved] = useState(false);

  const handleToggle = () => {
    if (saved) {
      removeGift(personName, gift.name);
    } else {
      saveGift(personName, gift.name);
    }
    setSaved(!saved);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          {gift.name}
        </h3>
        <span className="text-sm font-semibold text-[#FF6B6B] bg-red-50 px-3 py-1 rounded-full whitespace-nowrap ml-2">
          {gift.price}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{gift.reason}</p>
      <div className="flex gap-2 mt-2">
        <a
          href={getNaverShoppingUrl(gift.searchKeyword)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition-colors"
        >
          네이버
        </a>
        <a
          href={getCoupangUrl(gift.searchKeyword)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm bg-[#E42A2A] hover:bg-[#c72424] text-white py-2 rounded-xl transition-colors"
        >
          쿠팡
        </a>
        <a
          href={getKakaoGiftUrl(gift.searchKeyword)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm bg-[#FEE500] hover:bg-[#f0d800] text-[#3C1E1E] py-2 rounded-xl transition-colors"
        >
          카카오
        </a>
      </div>
      <button
        onClick={handleToggle}
        className={`w-full text-sm py-2 rounded-xl transition-colors ${
          saved
            ? 'bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-400'
            : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
        }`}
      >
        {saved ? '이력 저장됨 (취소하기)' : '이 선물 줬어요'}
      </button>
    </div>
  );
}
