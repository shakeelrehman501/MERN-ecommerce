import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addProduct } from "@/api/productApi";

const AddProduct = () => {

const dispatch = useDispatch();

const [loading, setLoading] = useState(false);

const { products } = useSelector(
  (store) => store.product,
);

const [productData, setProductData] = useState({
  productName: "",
  productPrice: 0,
  productDesc: "",
  productImg: [],
  brand: "",
  category: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;

  setProductData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const submitHandler = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (productData.productImg.length === 0) {
    toast.error("Please select at least one image");
    return;
  }

  const formData = new FormData();

  formData.append(
    "productName",
    productData.productName,
  );

  formData.append(
    "productPrice",
    productData.productPrice,
  );

  formData.append(
    "productDesc",
    productData.productDesc,
  );

  formData.append(
    "category",
    productData.category,
  );

  formData.append(
    "brand",
    productData.brand,
  );

  productData.productImg.forEach((img) => {
    formData.append("files", img);
  });

  try {
    setLoading(true);

    const data = await addProduct(formData);
    dispatch(
      setProducts([
        ...products,
        data.data,
      ]),
    );

    toast.success(data.message);

    // Optional: reset form
    setProductData({
      productName: "",
      productPrice: 0,
      productDesc: "",
      productImg: [],
      brand: "",
      category: "",
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Something went wrong. Please try again.",
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className=" py-25 px-3 md:px-6 lg:px-10 mx-auto  bg-gray-100 min-h-screen lg:pl-80">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">   
            <div className="grid gap-2">
              <Label>Product Name</Label>  
              <Input 
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Ex-IPhone"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>

            <div className="grid  sm:grid-cols-2 gap-4">
              {/* Brand */}
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Ex-apple"
                  required
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Ex-mobile"
                  required
                />
              </div>
                </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label>Description</Label>
                </div>
                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                  placeholder="Enter brief description of product"
                />
              </div>
              <ImageUpload
                productData={productData}
                setProductData={setProductData}
              />
          </div>
          <CardFooter className="flex-col gap-2 bg-white border-t-0 px-0">
            <Button
              disabled={loading}
              type="submit"
              onClick={submitHandler}
              className="cursor-pointer w-full bg-blue-600 text-white mt-2 py-4"
            >
              {loading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 className="animate-spin" />
                  Please wait
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
