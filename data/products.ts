export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Maglia Trend Wave",
    price: 19.99,
    category: "maglie",
    image: "/products/maglia1.jpg",
  },
  {
    id: 2,
    name: "Cappellino Akira",
    price: 14.99,
    category: "cappellini",
    image: "/products/cappellino1.jpg",
  },
  {
    id: 3,
    name: "Gadget personalizzabile",
    price: 9.99,
    category: "gadget",
    image: "/products/gadget1.jpg",
  },
];