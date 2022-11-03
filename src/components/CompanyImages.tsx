import React from 'react';

const databases = [
  { alt: 'oracle', imageUrl: '/images/nasa_image.png' },
  { alt: 'mysql', imageUrl: '/images/nasa_image.png' },
  { alt: 'postgresql', imageUrl: '/images/nasa_image.png' },
  { alt: 'microsoft sql server', imageUrl: '/images/nasa_image.png' },
  { alt: 'sqlite', imageUrl: '/images/nasa_image.png' },
  { alt: 'mongo db', imageUrl: '/images/nasa_image.png' },
  { alt: 'oracle cloud', imageUrl: '/images/nasa_image.png' },
  { alt: 'amazon redshift', imageUrl: '/images/nasa_image.png' },
  { alt: 'azure sql db', imageUrl: '/images/nasa_image.png' },
  { alt: 'db2', imageUrl: '/images/nasa_image.png' },
];

export default function CompanyImages(): JSX.Element {
  return (
    <div className="w-full flex flex-wrap justify-center gap-6">
      {databases.map(({ alt, imageUrl }) => (
        <button
          key={alt}
          className="flex justify-center items-center h-20 w-20 rounded-2xl shadow-imageShadow border border-grey-300 bg-badgeBackgground cursor-pointer py-5"
          onClick={() => {
            console.log('click item');
          }}
        >
          <img src={imageUrl} alt={alt} className="h-full" />
        </button>
      ))}
    </div>
  );
}
