import { IGalleryImage } from "@/lib/types";
import GalleryImage from "./GalleryImage";

const GalleryGrid = ({ images }: { images: IGalleryImage[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div 
          key={image._id}
          className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
            image.span === 'col' ? 'md:col-span-2' : 
            image.span === 'row' ? 'row-span-2' : 
            image.span === 'both' ? 'md:col-span-2 row-span-2' : ''
          }`}
        >
          <GalleryImage
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            fallbackClassName="w-full h-full min-h-[200px]"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
