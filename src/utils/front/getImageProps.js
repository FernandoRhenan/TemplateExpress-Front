export default function getImageProps(file) {
   const imgProps = new Promise((resolve, reject) => {
      if (!file) {
         reject('No file selected')
         return
      }

      // Creates a new instance of FileReader, which is used to get data about the file through File class.
      // 'const file' is an instance of File class.
      const reader = new FileReader()

      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file)

      // When the reader finishes reading the url, it triggers the onload event.
      reader.onload = (event) => {
         // Create a Blob from the ArrayBuffer
         const blob = new Blob([event.target.result], { type: file.type })

         // Create a URL from the Blob
         const url = URL.createObjectURL(blob)

         // Creates a new instance of Image to represents an image.
         const img = new Image()

         // img.src receive the Base64 URL
         img.src = url

         // Active when the url is assigned to the image.
         img.onload = () => {
            // Memory free
            URL.revokeObjectURL(url)
            resolve({ width: img.width, height: img.height, img: img })
         }

         img.onerror = () => {
            URL.revokeObjectURL(url)
            reject('Failed to load image')
         }
      }
      reader.onerror = () => reject('Failed to read file')
   })

   return imgProps
}
