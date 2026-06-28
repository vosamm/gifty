export function getNaverShoppingUrl(keyword: string): string {
  return `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(keyword)}`;
}

export function getCoupangUrl(keyword: string): string {
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`;
}

export function getKakaoGiftUrl(keyword: string): string {
  return `https://gift.kakao.com/search/result?query=${encodeURIComponent(keyword)}&searchType=search_typing_keyword`;
}
