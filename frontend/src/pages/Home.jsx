import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";

const placeholderProducts = [
  {
    _id: "1",
    name: "Casual Shirt",
    price: 45,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=3",
        altText: "Casual Shirt",
      },
    ],
  },
  {
    _id: "2",
    name: "Leather Boots",
    price: 85,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=4",
        altText: "Leather Boots",
      },
    ],
  },
  {
    _id: "3",
    name: "Denim Jeans",
    price: 60,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=5",
        altText: "Denim Jeans",
      },
    ],
  },
  {
    _id: "4",
    name: "Wool Sweater",
    price: 70,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=6",
        altText: "Wool Sweater",
      },
    ],
  },
  {
    _id: "5",
    name: "Stylish Jacket",
    price: 120,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=7",
        altText: "Stylish Jacket",
      },
    ],
  },
  {
    _id: "6",
    name: "Trendy Sunglasses",
    price: 60,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=8",
        altText: "Trendy Sunglasses",
      },
    ],
  },
  {
    _id: "7",
    name: "Classic Watch",
    price: 150,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=9",
        altText: "Classic Watch",
      },
    ],
  },
  {
    _id: "8",
    name: "Sporty Sneakers",
    price: 90,
    images: [
      {
        url: "https://picsum.photos/500/500?/random=10",
        altText: "Sporty Sneakers",
      },
    ],
  },
];
const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Seller */}
      <h2 className="text-3xl font-bold mb-4 text-center">Best Seller</h2>
      <ProductDetails />
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
