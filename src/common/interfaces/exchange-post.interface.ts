export interface ExchangeElement {
  title: string;
  author: string;
  coverImage: string;
  edition: string;
  condition: string;
  quantity: number;
}
export interface ExchangePost {
  requestedComics: ExchangeElement[];
  postContent: string;
}
