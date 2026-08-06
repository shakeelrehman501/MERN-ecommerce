import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;

  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  return (
    <div className="pt-24 py-5 lg:py-10 max-w-7xl mx-auto px-4">
      <Breadcrums product={product} />

      <div className="mt-6 lg:mt-10 flex flex-col md:flex-row gap-8 md:gap-5 lg:gap-6 ">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
