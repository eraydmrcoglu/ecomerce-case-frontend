export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  ratingCount: number;
  badge?: "Most ordered" | "Top rated";
};