
interface BandMemberProps {
  name: string;
  instrument: string;
  bio: string;
  image: string;
  isReversed?: boolean;
}

const BandMember = ({ name, instrument, bio, image, isReversed = false }: BandMemberProps) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 items-center`}>
      <div className="w-full md:w-1/3 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="w-full md:w-2/3">
        <h3 className="font-circus text-2xl text-circus-red font-bold">{name}</h3>
        <p className="font-alt text-circus-gold mb-4">{instrument}</p>
        <p className="font-alt text-lg leading-relaxed">{bio}</p>
      </div>
    </div>
  );
};

export default BandMember;
