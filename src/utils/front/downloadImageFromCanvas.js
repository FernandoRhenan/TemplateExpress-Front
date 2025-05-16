export default function downloadImageFromCanvas(canvas) {
   // Creates a Blob object representing the image contained in the canvas.
   canvas.toBlob((blob) => {
      if (blob) {
         // Creates a new url with blob data.
         const url = URL.createObjectURL(blob)
         // Creates a new HTML element (<a></a>)
         const link = document.createElement('a')
         link.href = url
         link.download = 'canvas-image.png'
         link.click()

         // Memory free
         URL.revokeObjectURL(url)
      }
      // image format
   }, 'image/png')
}
