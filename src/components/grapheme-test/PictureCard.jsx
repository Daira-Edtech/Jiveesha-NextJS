

const PictureCard = ({ letter }) => {

  return (
    <div className="w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-xl text-4xl font-bold">
      {/* If there was a label: <span className="text-sm">{t('cardLetterLabel')}</span> */}
      {letter}
    </div>
  );
};

export default PictureCard;