"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { products as initialProducts } from "@/data/products"

export default function RecommendationSlider() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // Load products from localStorage if available, otherwise use initial data
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts).slice(0, 4))
    } else {
      setProducts(initialProducts.slice(0, 4))
    }
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-2">{product.category}</div>
            <Link href={`/product/${product.id}`} className="block">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-contain"
                />
              </div>
              <h3 className="font-medium mt-3 mb-1">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
            </div>
            <div className="font-bold mb-3">${product.price.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Add to Cart
              </Button>
              <Button size="sm" className="flex-1">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
