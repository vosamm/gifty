'use client';

import { useState, useEffect } from 'react';
import { GiftFormData } from '@/types';
import { getHistory } from '@/lib/history';
import HistoryBadge from './HistoryBadge';

interface GiftFormProps {
  onSubmit: (data: GiftFormData) => void;
}

const AGE_OPTIONS = ['10대', '20대', '30대', '40대 이상'];
const RELATION_OPTIONS = ['친한 친구', '연인', '부모님', '지인'];
const BUDGET_OPTIONS = ['1만원 이하', '1-3만원', '3-5만원', '5-10만원', '10만원 이상'];
const MOOD_OPTIONS = ['실용적', '감성적', '재미있는', '특별한 경험'];

function SelectButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
        selected
          ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
      }`}
    >
      {label}
    </button>
  );
}

export default function GiftForm({ onSubmit }: GiftFormProps) {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [form, setForm] = useState<GiftFormData>({
    name: '',
    age: '',
    relation: '',
    interests: '',
    dislikes: '',
    context: '',
    budget: '',
    mood: '',
    avoidCliche: false,
  });

  useEffect(() => {
    if (form.name.trim()) {
      setHistory(getHistory(form.name.trim()));
    } else {
      setHistory([]);
    }
  }, [form.name]);

  const setField = <K extends keyof GiftFormData>(key: K, value: GiftFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedStep1 = form.name.trim() && form.age && form.relation;
  const canProceedStep2 = form.interests.trim();
  const canProceedStep3 = form.budget;
  const canProceedStep4 = form.mood;

  const handleSubmit = () => {
    if (canProceedStep4) {
      onSubmit(form);
    }
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step
                ? 'w-8 bg-[#FF6B6B]'
                : s < step
                ? 'w-2 bg-[#FF6B6B] opacity-40'
                : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: 기본 정보 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">누구에게 선물할까요?</h2>
            <p className="text-sm text-gray-500">받는 사람의 기본 정보를 알려주세요</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">이름 (별명 가능)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="예: 민지, 엄마, 베프"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B6B] transition-colors"
            />
            <HistoryBadge gifts={history} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">나이대</label>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((option) => (
                <SelectButton
                  key={option}
                  label={option}
                  selected={form.age === option}
                  onClick={() => setField('age', option)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">관계</label>
            <div className="flex flex-wrap gap-2">
              {RELATION_OPTIONS.map((option) => (
                <SelectButton
                  key={option}
                  label={option}
                  selected={form.relation === option}
                  onClick={() => setField('relation', option)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
              canProceedStep1
                ? 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      )}

      {/* Step 2: 취향 정보 */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">취향을 알려주세요</h2>
            <p className="text-sm text-gray-500">구체적일수록 더 좋은 추천을 받을 수 있어요</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">취미 및 관심사</label>
            <textarea
              value={form.interests}
              onChange={(e) => setField('interests', e.target.value)}
              placeholder="예: 독서, 캠핑, 요리 배우기, 빈티지 소품 수집..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B6B] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              싫어하는 것 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              value={form.dislikes}
              onChange={(e) => setField('dislikes', e.target.value)}
              placeholder="예: 향수류, 너무 실용적인 것, 음식류..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B6B] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              추가 맥락 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              value={form.context}
              onChange={(e) => setField('context', e.target.value)}
              placeholder="예: 겨울 선물이에요 / 졸업 축하 선물 / 최근에 이사를 했어요..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B6B] transition-colors resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                canProceedStep2
                  ? 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 예산 */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">예산은 얼마인가요?</h2>
            <p className="text-sm text-gray-500">범위를 선택해주세요</p>
          </div>

          <div className="flex flex-col gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setField('budget', option)}
                className={`w-full py-3 rounded-xl text-sm font-medium border transition-colors text-left px-4 ${
                  form.budget === option
                    ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!canProceedStep3}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                canProceedStep3
                  ? 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 분위기 */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">어떤 분위기의 선물을 원하나요?</h2>
            <p className="text-sm text-gray-500">원하는 선물의 느낌을 선택해주세요</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => (
              <SelectButton
                key={option}
                label={option}
                selected={form.mood === option}
                onClick={() => setField('mood', option)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setField('avoidCliche', !form.avoidCliche)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
              form.avoidCliche
                ? 'border-[#FF6B6B] bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-left">
              <p className={`text-sm font-medium ${form.avoidCliche ? 'text-[#FF6B6B]' : 'text-gray-700'}`}>
                뻔하지 않은 선물
              </p>
              <p className="text-xs text-gray-400 mt-0.5">커피쿠폰, 상품권 등 흔한 선물 제외</p>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              form.avoidCliche ? 'bg-[#FF6B6B]' : 'bg-gray-200'
            }`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                form.avoidCliche ? 'left-6' : 'left-1'
              }`} />
            </div>
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceedStep4}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                canProceedStep4
                  ? 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              선물 추천받기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
