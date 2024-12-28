import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import  ImageEditor from '../../../../ui/ImageUploadAndEditor/ImageEditor/ImageEditor'
import React from 'react'
import RV7A from '../../../../lib/images/RV7A.jpg'

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

    it('correctly styles the circle button on click', () => {
        const circleToolContainer = screen.getByTestId('drawing-tool-button-circle')
        const circleToolStyledDiv = circleToolContainer.querySelector('div')

        expect(circleToolStyledDiv).toHaveClass('bg-green-500')

        fireEvent.click(circleToolContainer)

        expect(circleToolStyledDiv).toHaveClass('bg-red-500')
    })

    it('correctly styles the square button on click', () => {
        const squareToolContainer = screen.getByTestId('drawing-tool-button-square')
        const squareToolStyledDiv = squareToolContainer.querySelector('div')

        expect(squareToolStyledDiv).toHaveClass('bg-yellow-300')

        fireEvent.click(squareToolContainer)

        expect(squareToolStyledDiv).toHaveClass('bg-red-500')
    })

    it('correctly styles the line button on click', () => {
        const lineToolContainer = screen.getByTestId('drawing-tool-button-line')
        const lineToolStyledDiv = lineToolContainer.querySelector('div')

        fireEvent.click(lineToolContainer)

        expect(lineToolStyledDiv).toHaveClass('bg-red-500')
    })

    it('correctly styles the radiused circle button on click', () => {
        const radiusedCircleToolContainer = screen.getByTestId('drawing-tool-button-radiusedcircle')
        const radiusedCircleToolStyledDiv = radiusedCircleToolContainer.querySelector('div')

        fireEvent.click(radiusedCircleToolContainer)

        expect(radiusedCircleToolStyledDiv).toHaveClass('bg-red-500')
    })

    // TODO: text tool
})

