import { IBandMember } from "@/lib/types";

interface BandMemberProps {
  member: IBandMember;
}

const BandMember = ({ member }: BandMemberProps) => {
  const { name, instrument, bio, image } = member;
  
  return (
    <div className="flex flex-col gap-6 items-center bg-white bg-opacity-70 p-6 rounded-lg shadow-md">
      <div className="w-full overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="w-full text-center">
        <h3 className="font-circus text-2xl text-circus-red font-bold">{name}</h3>
        <p className="font-alt text-circus-gold mb-4">{instrument}</p>
        <p className="font-alt text-lg leading-relaxed">{bio}</p>
      </div>
    </div>
  );
};

export default BandMember;
