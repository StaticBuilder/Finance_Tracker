import React, { useEffect, useState } from "react";

function ImageCarousel() {
  const images = [
    "https://media.istockphoto.com/id/1257717196/photo/kenyan-coins-on-the-background-of-money.jpg?s=2048x2048&w=is&k=20&c=hOcyTvMGzdBFUEHsvE2n_LPTzXsho9OpZafxmlqNOu0=",
    "https://media.istockphoto.com/id/1158052678/photo/five-hundred-kenyan-shilling-on-a-pile-of-various-kenyan-shilling-notes-top-view.jpg?s=2048x2048&w=is&k=20&c=4cC6BrfeRzqI4clQRgx6zzJyOyH1HK39Ucpq_NSHuaY=",
    "https://media.istockphoto.com/id/1161898919/photo/kenyan-shilling-a-background.jpg?s=2048x2048&w=is&k=20&c=j0xODJFgDvkqCip_gM97QaKhO8X_jaZqj6-1VUT23NA=",
    "https://media.istockphoto.com/id/1152454581/photo/business-object.jpg?s=2048x2048&w=is&k=20&c=o-xRY_50vzWlH6JWZ93DOAnKyxus9l4vyGTEB46fZtE=",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
        src={images[currentImage]}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500"
      />
    </section>
  );
}

export default ImageCarousel;
