import Header from "../components/header";
import ProductGrid from "../components/product-grid";
import Footer from "../components/footer";
import { useState } from "react";

export default function Store() {
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSortChange = (option) => {
    setSortOption(option);
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId || "");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      <ProductGrid
        sortOption={sortOption}
        selectedCategory={selectedCategory}
      />
      <Footer />
    </div>
  );
}
