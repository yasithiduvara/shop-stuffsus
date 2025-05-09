"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showFilters, setShowFilters] = useState<boolean>(true)

  const categories = [
    { id: "all", name: "All Products" },
    { id: "home", name: "For Home" },
    { id: "music", name: "For Music" },
    { id: "phone", name: "For Phone" },
    { id: "storage", name: "For Storage" },
  ]

  const filters = [
    { id: "new", name: "New Arrival" },
    { id: "best", name: "Best Seller" },
    { id: "discount", name: "On Discount" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3 text-gray-900">Category</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md ${
                  selectedCategory === category.id ? "bg-gray-100" : ""
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    selectedCategory === category.id ? "bg-black border-black" : "border-gray-300"
                  }`}
                >
                  {selectedCategory === category.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full font-medium mb-3"
        >
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <ul className="space-y-2">
            {filters.map((filter) => (
              <li key={filter.id}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span>{filter.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
