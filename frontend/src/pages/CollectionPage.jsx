import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
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
      setProducts(fetchedProducts);
    }, 1000);
  }, []);
  return (
    <div className="flex flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        <SortOptions />
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default CollectionPage;
