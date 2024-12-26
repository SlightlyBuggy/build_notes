import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
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

    it('renders the square tool button', () => {
        const squareToolButton = screen.getByTestId('drawing-tool-button-square')
        expect(squareToolButton).toBeInTheDocument()
    })

    it('renders the circle tool button', () => {
        const circleToolButton = screen.getByTestId('drawing-tool-button-circle')
        expect(circleToolButton).toBeInTheDocument()
    })

    it('renders the line tool button', () => {
        const lineToolButton = screen.getByTestId('drawing-tool-button-line')
        expect(lineToolButton).toBeInTheDocument()
    })

    it('renders the radiused circle tool button', () => {
        const radiusedCircleToolButton = screen.getByTestId('drawing-tool-button-radiusedcircle')
        expect(radiusedCircleToolButton).toBeInTheDocument()
    })

    it('renders the undo button', () => {
        const undoButton = screen.getByTestId('undo-button')
        expect(undoButton).toBeInTheDocument()
    })

    it('renders the redo button', () => {
        const redoButton = screen.getByTestId('redo-button')
        expect(redoButton).toBeInTheDocument()
    })
})

