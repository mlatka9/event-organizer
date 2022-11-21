interface UserImageProps {
  imageUrl: string | null;
  userName: string;
}

const UserImage = ({ imageUrl, userName }: UserImageProps) => {
  return (
    <img src={imageUrl || '/images/avatar-fallback.svg'} className={'w-10 h-10 rounded-full block'} alt={userName} />
  );
};

export default UserImage;
