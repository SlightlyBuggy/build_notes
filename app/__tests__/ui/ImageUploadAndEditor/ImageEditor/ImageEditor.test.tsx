import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import  ImageEditor from '../../../../ui/ImageUploadAndEditor/ImageEditor/ImageEditor'
import React from 'react'
import RV7A from '../../../../lib/images/RV7A.jpg'

describe('ImageEditor', () => {
    it('renders the ImageEditor component with a provided image', () => {
        render(<ImageEditor imageData={RV7A}/>)

        const image = screen.getByRole('img')

        expect(image).toBeInTheDocument()
    })
})

