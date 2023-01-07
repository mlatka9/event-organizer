interface FeatureCardProps {
  title: string;
  text: string;
}

const FeatureCard = ({ text, title }: FeatureCardProps) => {
  return (
    <div className={'max-w-[500px]'}>
      <h2 className={'font-semibold text-lg mb-3 text-neutral-800'}>{title}</h2>
      <p className={'text-neutral-600'}>{text}</p>
    </div>
  );
};

export default FeatureCard;
