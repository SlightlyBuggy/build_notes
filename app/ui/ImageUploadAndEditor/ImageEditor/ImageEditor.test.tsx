import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import  ImageEditor from './ImageEditor'
import RV7A from '../../../lib/images/RV7A.jpg'
import UndoButton from './UndoButton'

describe('ImageEditor', () => {
    it('renders the ImageEditor component', () => {
        render(<ImageEditor imageData={RV7A}/>)

        const image = screen.getByRole('img')

        expect(image).toBeInTheDocument()
    })
})
