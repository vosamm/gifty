import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, age, relation, interests, dislikes, context, budget, mood, history, avoidCliche } = body;

  const historyText = history?.length > 0
    ? `과거에 준 선물 (이것들은 절대 추천하지 말 것): ${history.join(', ')}`
    : '과거 선물 이력 없음';

  const prompt = `
당신은 창의적인 선물 큐레이터입니다.
아래 정보를 바탕으로 뻔하지 않으면서도 받는 사람이 분명히 좋아할 선물 3가지를 추천해주세요.

[받는 사람 정보]
- 이름: ${name}
- 나이대: ${age}
- 관계: ${relation}
- 취미/관심사: ${interests}
- 싫어하는 것: ${dislikes || '없음'}
- 추가 맥락: ${context || '없음'}
- 예산: ${budget}
- 원하는 분위기: ${mood}

[이력]
${historyText}

[추천 규칙]
${avoidCliche ? '1. 커피쿠폰, 상품권, 화장품 세트 같은 뻔한 선물은 절대 추천하지 말 것\n2.' : '1.'} 취향의 "본질"을 파악해서 연관된 선물을 추천할 것
${avoidCliche ? '3.' : '2.'} Google Search로 2025-2026년 최신 트렌드 상품을 반드시 참고할 것
${avoidCliche ? '4.' : '3.'} 각 선물은 서로 카테고리가 겹치지 않을 것

[출력 형식] 반드시 아래 JSON 형식으로만 응답. JSON 외 다른 텍스트 절대 포함하지 말 것:
{
  "gifts": [
    {
      "name": "선물명",
      "reason": "이 선물을 추천하는 이유 (취향과의 연결고리 포함, 2-3문장)",
      "price": "예상 가격대",
      "searchKeyword": "네이버 쇼핑 검색어"
    }
  ]
}
`;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL!,
        tools: [{ googleSearch: {} }] as any,
      });

      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          await writer.write(encoder.encode(text));
        }
      }
    } catch (error) {
      console.error('Gemini API error:', JSON.stringify(error, null, 2));
      let message = '추천 생성 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          message = 'AI 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          message = error.message;
        }
      }
      await writer.write(encoder.encode(JSON.stringify({ error: message })));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
