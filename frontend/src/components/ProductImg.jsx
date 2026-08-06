import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-3  sm:items-center md:items-start  ">
      <div className="gap-2 flex flex-row md:flex-col  ">
        {images.map((img) => {
          return (
            <img
              key={img.url}
              src={img.url}
              alt=""
              onClick={() => setMainImg(img.url)}
              className="cursor-pointer w-15 h-15 rounded-lg md:w-16.5 md:h-16.5 lg:w-22.5 lg:h-22.5  border shadow-md"
            />
          );
        })}
      </div>
      <Zoom>
        <img
          src={mainImg}
          alt=""
          className="w-full sm:w-82 md:w-90 lg:w-120 border rounded-lg shadow-md"
        />
      </Zoom>
    </div>
  );
};

export default ProductImg;
