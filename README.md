# GIFTY

AI가 찾아주는 맞춤 선물 추천 서비스

**배포:** https://vosamm-gifty.vercel.app   

## 소개

받는 사람의 취향 정보를 입력하면 Gemini 2.5 Flash + Google Search를 활용해 맞춤 선물을 추천해줍니다.
네이버 쇼핑, 쿠팡, 카카오 선물하기 검색 링크를 바로 제공하고, 선물 이력을 저장해 중복 추천을 방지합니다.

## 기능

- 취향 기반 선물 추천 (나이대, 관계, 취미, 예산, 분위기)
- 추가 맥락 입력 (계절, 특수한 상황 등 자유 입력)
- 뻔하지 않은 선물 모드 (토글)
- 네이버 쇼핑 / 쿠팡 / 카카오 선물하기 검색 링크
- 다른 선물 재추천 (이미 본 선물 자동 제외)
- 선물 이력 저장 및 관리 (localStorage)

## 기술 스택

- Next.js 14 (App Router)
- Tailwind CSS
- Google Gemini 2.5 Flash + Google Search Grounding
- TypeScript

## 시작하기

```bash
npm install
```

`.env.local` 파일 생성 후 API 키 입력:

```
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
```

```bash
npm run dev
```
