import style from 'src/components/canvas.module.css'
import { useEffect, useRef, useState } from 'react'
import canvasTextFiller from 'src/utils/front/canvasTextFiller'
import { toast } from 'react-hot-toast'

function Canvas({ canvasProps: p }) {
   const previewBoxRef = useRef(null)

   // It's used to update the useEffect that contains this dependency to dynamically update the dimensions of the elements when the screen changes size.
   // its value is not actually used, it only serves as a dependency on useEffect.
   const [canvasCssSize, setCanvasCssSize] = useState(0)

   useEffect(() => {
      function setCanvasSize() {
         const canvas = p.canvasRef.current
         const { width } = canvas.getBoundingClientRect()
         setCanvasCssSize(width)
      }

      window.addEventListener('resize', setCanvasSize)
      return () => {
         window.removeEventListener('resize', setCanvasSize)
      }
   }, [p.canvasRef])

   useEffect(() => {
      const canvas = p.canvasRef.current

      const handleSetCursorPosition = (e) => {
         if (p.fieldName == '') {
            toast.error('Preencha o nome do campo!', { duration: 3000 })
            if (p.fieldNameRef.current) {
               p.fieldNameRef.current.focus()
            }
            return
         }

         const ctx = canvas.getContext('2d')

         const { width, height, left, top } = canvas.getBoundingClientRect()

         // Calculate the scale in relation to the original canvas size.
         const scaleX = p.width / width
         const scaleY = p.height / height

         const baseBoxHeight = parseInt(p.fontSize)

         // Gets the cursor coordinates related to the scaled canvas
         const cx = Math.round((e.clientX - left) * scaleX)
         const cy = Math.round((e.clientY - top) * scaleY + baseBoxHeight)

         const text = p.textareaValue.split('\n')

         if (text.length > p.maxRows) {
            toast.error('Número máximo de linhas atingido.')
            return
         }

         // Sets the original size of the preview box
         // Gets metrics about typed text
         let { fontBoundingBoxDescent } = ctx.measureText(p.textareaValue)

         const tempArray = [...p.pointsStack]
         tempArray.push({
            fontFamily: p.fontFamily.fontFamily,
            bold: p.textStyle.bold,
            italic: p.textStyle.italic,
            fontSize: p.fontSize,
            fillStyle: p.textColor,
            x: cx,
            y: cy,
            baseBoxHeight,
            fontBoundingBoxDescent,
            maxRows: p.maxRows,
            fieldName: p.fieldName,
         })

         p.setPointsStack(tempArray)

         ctx.font = `${p.textStyle.bold ? 'bold' : ''} ${p.textStyle.italic ? 'italic' : ''} ${p.fontSize}px ${p.fontFamily.fontFamily}`
         ctx.fillStyle = p.textColor

         canvasTextFiller(text, ctx, cx, cy, baseBoxHeight, fontBoundingBoxDescent, p.maxRows)

         ctx.strokeRect(
            cx,
            cy - baseBoxHeight,
            p.widthRange,
            (baseBoxHeight + parseInt(fontBoundingBoxDescent)) * text.length
         )
      }

      canvas.addEventListener('click', handleSetCursorPosition)

      return () => {
         canvas.removeEventListener('click', handleSetCursorPosition)
      }
   }, [p])

   // Cursor
   useEffect(() => {
      const canvas = p.canvasRef.current
      let animationFrameId

      const handleMovePreviewBox = (e) => {
         cancelAnimationFrame(animationFrameId)

         animationFrameId = requestAnimationFrame(() => {
            const { width, left } = canvas.getBoundingClientRect()

            const scaleX = p.width / width

            const limitEdgeX =
               parseInt(e.clientX) - parseInt(left) + parseInt(p.widthRange / scaleX)

            if (limitEdgeX < width) {
               previewBoxRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
            } else {
               previewBoxRef.current.style.transform = `translate(${e.clientX - limitEdgeX + width}px, ${e.clientY}px)`
            }
         })
      }

      canvas.addEventListener('mousemove', handleMovePreviewBox)

      return () => {
         canvas.removeEventListener('mousemove', handleMovePreviewBox)
         cancelAnimationFrame(animationFrameId)
      }
   }, [p.imageUrl, p.canvasRef, p.width, p.widthRange])

   // Sets de text color
   useEffect(() => {
      previewBoxRef.current.style.color = p.textColor
   }, [p.textColor])

   // Limits the text width in previewBox
   useEffect(() => {
      const canvas = p.canvasRef.current

      const ctx = canvas.getContext('2d')

      const text = p.textareaValue.split('\n')

      let longerLine = 0

      text.forEach((line) => {
         let { width } = ctx.measureText(line)
         if (width > longerLine) {
            longerLine = width
         }
      })
      if (longerLine < p.widthRange) {
         previewBoxRef.current.innerText = p.textareaValue
      }
   }, [p.textareaValue, p.widthRange, p.canvasRef])

   // Updates previewBox width
   useEffect(() => {
      const { width } = p.canvasRef.current.getBoundingClientRect()

      const scaleX = p.width / width

      previewBoxRef.current.style.width = `${p.widthRange / scaleX}px`
   }, [p.widthRange, p.canvasRef, p.width, canvasCssSize])

   // Updates font style
   useEffect(() => {
      previewBoxRef.current.style.fontWeight = p.textStyle.bold ? 'bold' : 'normal'
      previewBoxRef.current.style.fontStyle = p.textStyle.italic ? 'italic' : 'normal'
   }, [p.textStyle])

   // previewBox height + fontSize
   useEffect(() => {
      const canvas = p.canvasRef.current
      const ctx = canvas.getContext('2d')

      const { height } = canvas.getBoundingClientRect()
      const scaleY = p.height / height

      previewBoxRef.current.style.fontSize = `${p.fontSize / scaleY}px`

      ctx.font = `${p.fontSize}px ${p.fontFamily.fontFamily}` // Certifique-se de que a fonte está configurada
      let { fontBoundingBoxDescent } = ctx.measureText(p.textareaValue)

      const baseBoxHeight = parseInt(p.fontSize) + parseInt(fontBoundingBoxDescent)

      const text = p.textareaValue.split('\n')
      previewBoxRef.current.style.height = `${(baseBoxHeight * text.length) / scaleY}px`
      previewBoxRef.current.style.lineHeight = `${baseBoxHeight / scaleY}px`
   }, [p.fontSize, p.height, p.canvasRef, p.textareaValue, p.fontFamily.fontFamily, canvasCssSize])

   useEffect(() => {
      const canvas = p.canvasRef.current

      const ctx = canvas.getContext('2d')
      ctx.drawImage(p.imageUrl, 0, 0)
   }, [p.canvasRef, p.imageUrl])

   return (
      <div className={style.container}>
         <span
            className={`${p.fontFamily.fontClassname} ${style.previewBox}`}
            ref={previewBoxRef}
         ></span>

         <div>
            {/* Width and height refers to original size of image. Size here must be orignial, and only manipulate only by css, which will not affect the resolution.  */}
            <canvas
               ref={p.canvasRef}
               width={p.width}
               height={p.height}
               className={style.canvas}
            ></canvas>
         </div>
      </div>
   )
}

export default Canvas
