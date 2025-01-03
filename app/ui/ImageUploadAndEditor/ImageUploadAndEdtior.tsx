'use client';

import { StaticImageData } from 'next/image';
import ImageUpload from './ImageUpload';
import { useState } from 'react';
import ImageEditor from './ImageEditor/ImageEditor';

export default function ImageUploadAndEditor() {
  const [imageData, setImageData] = useState<StaticImageData | null>();

  if (!imageData) {
    return (
      <div className="flex justify-center">
        <ImageUpload setImageData={setImageData} />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <ImageEditor imageData={imageData} />
      </div>
    );
  }
}
