import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Edit, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { setProducts } from "@/redux/productSlice";
import axios from "axios";
import { toast } from "sonner";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  }
  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", editProduct.productName);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // Add existing images public_ids
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );

      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-3 md:px-6 lg:px-10 pb-10 pt-25 flex flex-col gap-3 min-h-screen bg-gray-100 lg:pl-80">
      <div className="flex justify-between gap-3">
        <div className="relative bg-white rounded-lg max-w-100 w-full min-w-45">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Product..."
            className=" items-center"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-50 bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>

            <SelectItem value="highToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 ">
        {filteredProducts.map((product, index) => {
          return (
            <Card key={index} className="px-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex gap-2 items-center">
                  <img
                    src={product.productImg[0].url}
                    alt=""
                    className="w-25 h-25"
                  />

                  <h1 className="font-bold max-w-115 line-clamp-4 wrap-break-words text-gray-700">
                    {product.productName}
                  </h1>
                </div>
                <div className="flex  w-full sm:max-w-70 pl-27 sm:pl-1  justify-between gap-10   ">
                  <div className="sm:w-full sm:max-w-20 sm:mx-auto sm:text-center">
                    <h1 className="font-semibold text-gray-800">
                      ₹{product.productPrice}
                    </h1>
                  </div>

                  <div className="flex gap-3 ">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Edit
                          onClick={() => {
                            (setOpen(true), setEditProduct(product));
                          }}
                          className="text-green-500 cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-150 max-h-190 overflow-y-scroll">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>
                            Make changes to your product here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                          <Field>
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                              id="productName"
                              type="text"
                              value={editProduct?.productName}
                              onChange={handleChange}
                              name="productName"
                              placeholder="EX-Iphone"
                              required
                            />
                          </Field>
                          <Field>
                            <Label htmlFor="productPrice">Product Price</Label>
                            <Input
                              id="productPrice"
                              type="number"
                              value={editProduct?.productPrice}
                              onChange={handleChange}
                              name="productPrice"
                              required
                            />
                          </Field>
                          <Field>
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                              id="brand"
                              type="text"
                              value={editProduct?.brand}
                              onChange={handleChange}
                              name="brand"
                              placeholder="EX-apple"
                              required
                            />
                          </Field>
                          <Field>
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              type="text"
                              value={editProduct?.category}
                              onChange={handleChange}
                              name="category"
                              placeholder="EX-mobile"
                              required
                            />
                          </Field>
                          <Field>
                            <Label>Description</Label>
                            <Textarea
                              name="productDesc"
                              value={editProduct?.productDesc}
                              onChange={handleChange}
                              placeholder="Enter brief description of product"
                              required
                            />
                          </Field>
                          <ImageUpload
                            productData={editProduct}
                            setProductData={setEditProduct}
                          />
                        </FieldGroup>
                        <DialogFooter>
                          <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                          />
                          <Button onClick={handleSave} type="submit">
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash2 className="text-red-500 cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProductHandler(product._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminProduct;
