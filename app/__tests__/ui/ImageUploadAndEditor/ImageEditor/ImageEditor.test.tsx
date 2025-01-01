import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import  ImageEditor from '../../../../ui/ImageUploadAndEditor/ImageEditor/ImageEditor'
import React from 'react'
import RV7A from '../../../../lib/images/RV7A.jpg'

const ACTIVE_CLASS = 'bg-green-500'

describe('ImageEditor', () => {

    beforeEach(() => {
        render(<ImageEditor imageData={RV7A}/>)
    })

    it('renders the ImageEditor component with a provided image', () => {
        const image = screen.getByRole('img')
        expect(image).toBeInTheDocument()
    })

    it('renders the permanent canvas', () => {
        const permCanvas = screen.getByTestId('canvas-perm')
        expect(permCanvas).toBeInTheDocument()
    })

    it('renders the temporary canvas', () => {
        const tempCanvas = screen.getByTestId('canvas-temp')
        expect(tempCanvas).toBeInTheDocument()
    })

    it('correctly styles the line button on click', () => {
        const lineToolContainer = screen.getByTestId('drawing-tool-button-line')
        const lineToolStyledDiv = lineToolContainer.querySelector('div')

        fireEvent.click(lineToolContainer)

        expect(lineToolStyledDiv).toHaveClass(ACTIVE_CLASS)
    })

    it('correctly styles the radiused circle button on click', () => {
        const radiusedCircleToolContainer = screen.getByTestId('drawing-tool-button-radiusedcircle')
        const radiusedCircleToolStyledDiv = radiusedCircleToolContainer.querySelector('div')

        fireEvent.click(radiusedCircleToolContainer)

        expect(radiusedCircleToolStyledDiv).toHaveClass(ACTIVE_CLASS)
    })

    it('correctly styles the rectangle button on click', () => {
        const rectangleToolContainer = screen.getByTestId('drawing-tool-button-rectangle')
        const radiusedCircleToolStyledDiv = rectangleToolContainer.querySelector('div')

        fireEvent.click(rectangleToolContainer)

        expect(radiusedCircleToolStyledDiv).toHaveClass(ACTIVE_CLASS)
    })

    // TODO: text tool
})

