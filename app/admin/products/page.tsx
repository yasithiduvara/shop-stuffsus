"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { products as initialProducts } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useNotifications } from "@/context/notification-context"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    reviews: 0,
    images: [""],
    colors: [{ name: "", value: "", hex: "" }],
  })

  const { addNotification } = useNotifications()

  useEffect(() => {
    // Load products from localStorage if available, otherwise use initial data
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      setProducts(initialProducts)
      localStorage.setItem("products", JSON.stringify(initialProducts))
    }
  }, [])

  const handleEditClick = (product: any) => {
    setCurrentProduct(product)
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      images: product.images,
      colors: product.colors,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (product: any) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "rating" || name === "reviews" ? Number.parseFloat(value) : value,
    })
  }

  const handleColorChange = (index: number, field: string, value: string) => {
    const updatedColors = [...formData.colors]
    updatedColors[index] = {
      ...updatedColors[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      colors: updatedColors,
    })
  }

  const addColorField = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "", value: "", hex: "" }],
    })
  }

  const removeColorField = (index: number) => {
    const updatedColors = formData.colors.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      colors: updatedColors,
    })
  }

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData({
      ...formData,
      images: updatedImages,
    })
  }

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    })
  }

  const removeImageField = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: updatedImages,
    })
  }

  const handleSaveChanges = () => {
    const originalProduct = products.find((product) => product.id === formData.id)

    // Check if this is a price decrease
    if (originalProduct && formData.price < originalProduct.price) {
      const priceDifference = originalProduct.price - formData.price
      const percentDecrease = ((priceDifference / originalProduct.price) * 100).toFixed(1)

      addNotification({
        title: "Price Decreased!",
        message: `${formData.name} price reduced from $${originalProduct.price.toFixed(2)} to $${formData.price.toFixed(2)} (${percentDecrease}% off)`,
        type: "success",
      })
    }

    const updatedProducts = products.map((product) => (product.id === formData.id ? formData : product))

    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    setIsEditDialogOpen(false)
  }

  const handleDeleteProduct = () => {
    const updatedProducts = products.filter((product) => product.id !== currentProduct.id)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    setIsDeleteDialogOpen(false)
  }

  const handleAddNewProduct = () => {
    // Generate a new ID
    const newId = `product-${Date.now()}`

    setCurrentProduct(null)
    setFormData({
      id: newId,
      name: "New Product",
      description: "Product description",
      price: 99.99,
      category: "Other",
      rating: 5,
      reviews: 0,
      images: ["/placeholder.svg"],
      colors: [{ name: "Black", value: "black", hex: "#000000" }],
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={handleAddNewProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                {product.rating} ({product.reviews} reviews)
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(product)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviews">Reviews Count</Label>
                <Input
                  id="reviews"
                  name="reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Image URL"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    disabled={formData.images.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addImageField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              {formData.colors.map((color, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    value={color.name}
                    onChange={(e) => handleColorChange(index, "name", e.target.value)}
                    placeholder="Color Name (e.g. Red)"
                  />
                  <Input
                    value={color.value}
                    onChange={(e) => handleColorChange(index, "value", e.target.value)}
                    placeholder="Color Value (e.g. red)"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={color.hex}
                      onChange={(e) => handleColorChange(index, "hex", e.target.value)}
                      placeholder="Hex Code (e.g. #FF0000)"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeColorField(index)}
                      disabled={formData.colors.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addColorField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Color
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{currentProduct?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
