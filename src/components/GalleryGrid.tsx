
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span?: 'col' | 'row' | 'both';
}

const GalleryGrid = ({ images }: { images: GalleryImage[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div 
          key={image.id}
          className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
            image.span === 'col' ? 'md:col-span-2' : 
            image.span === 'row' ? 'row-span-2' : 
            image.span === 'both' ? 'md:col-span-2 row-span-2' : ''
          }`}
        >
          <img 
            src={image.src} 
            alt={image.alt} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
