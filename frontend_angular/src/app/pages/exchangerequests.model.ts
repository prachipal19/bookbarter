export interface ExchangeRequest {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  status: string;
  listingIds: {
    _id: string;
    ISBN: string;
    img: string;
    title: string;
    author: string;
    inventory: number;
    category: string;
    isExchange: boolean;
  }[];
  bookId: string;
}
