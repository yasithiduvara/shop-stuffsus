"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { products } from "@/data/products";
import { useRouter } from "next/navigation";
import NotificationDropdown from "@/components/notification-dropdown";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Ensure this runs on client side only
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("products");
  
      if (storedProducts) {
        try {
          const parsedProducts = JSON.parse(storedProducts);
          setProducts(parsedProducts);  
          const foundProduct = parsedProducts.find((p: any) => p.id === params.id);
  
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedColor(foundProduct.colors[0]?.value || "");
          } else {
            router.push("/"); // Redirect if not found
          }
        } catch (error) {
          console.error("Error parsing products from localStorage", error);
          router.push("/");
        }
      } else {
        router.push("/");
      }
  
      setLoading(false);
    }
  }, [params.id, router]);
  

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              Stuffsus
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Heart className="w-5 h-5" />
            </button>
            <NotificationDropdown />
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-gray-900 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? "ring-1 ring-gray-400" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= product.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="text-gray-600 ml-2">
                {product.reviews} reviews
              </span>
            </div>

            
            <div className="text-3xl font-bold flex items-center gap-2">
              ${product.price.toFixed(2)}
              {product.previousPrice > 0 &&
                product.previousPrice !== product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.previousPrice.toFixed(2)}
                  </span>
                )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedColor(color.value);
                        setSelectedImage(color.index);
                      }}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor === color.value
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-100">
                  Buy Now
                </Button>
                <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                  Add to basket
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="flex items-center gap-2">
                    Dispatched in 5 - 7 weeks
                    <button className="text-gray-500">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 8v4M12 16h.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span>Why the longer lead time?</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span>Home Delivery - $10</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4">Recently viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="group"
              >
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-auto aspect-square object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium">{item.name}</h3>
                  
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    ${item.price.toFixed(2)}
                    {item.previousPrice > 0 &&
                      item.previousPrice !== item.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${item.previousPrice.toFixed(2)}
                        </span>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2023 Stuffsus. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
