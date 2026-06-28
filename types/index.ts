export interface GiftFormData {
  name: string;
  age: string;
  relation: string;
  interests: string;
  dislikes: string;
  context: string;
  budget: string;
  mood: string;
  avoidCliche: boolean;
}

export interface GiftRecommendation {
  name: string;
  reason: string;
  price: string;
  searchKeyword: string;
}
