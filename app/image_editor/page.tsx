'use client'

import  ImageEditor  from '@/app/ui/ImageEditor/ImageEditor'
import RV7A from '../lib/images/RV7A.jpg'

export default function Page() {

    return (
        <ImageEditor imageData={RV7A} />
    )
}
