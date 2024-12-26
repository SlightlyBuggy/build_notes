'use client'

export default function SaveDrawingButton(
    {saveImage} : {saveImage: () => void}
) {
    return (
    <div className="text-left m-10">
        <button data-testid='save-drawing-button' onClick={saveImage}>Save Drawing</button>
    </div>
    )
}