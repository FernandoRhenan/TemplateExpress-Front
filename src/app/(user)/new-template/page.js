'use client'

import style from './new-template.module.css'
import Canvas from 'src/components/Canvas'
import { useMemo, useRef, useState } from 'react'
import ToolSideBar from 'src/components/ToolSideBar'
import { inter } from 'src/utils/front/fonts'

export default function NewTemplate() {
   // States that are controlled in ToolSideBar.js
   const [textStyle, setTextStyle] = useState({ bold: false, italic: false })
   const [textColor, setTextColor] = useState('#000000')
   const [fontSize, setFontSize] = useState(14)
   const [fontFamily, setFontFamily] = useState({
      fontFamily: inter.style.fontFamily,
      fontClassname: inter.className,
   })
   const [textareaValue, setTextareaValue] = useState('')
   const [widthRange, setWidthRange] = useState(100)
   const [maxRows, setMaxRows] = useState(1)
   const [fieldName, setFieldName] = useState('')

   // States that are controlled in Canvas.js
   const [pointsStack, setPointsStack] = useState([])

   const [imageUrl, setImageUrl] = useState('')
   // The original dimensions of image
   const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

   const fieldNameRef = useRef(null)
   const canvasRef = useRef(null)

   const toolSideBarProps = useMemo(
      () => ({
         canvasRef,
         setImageUrl,
         setDimensions,
         width: dimensions.width,
         height: dimensions.height,
         hasImage: !!imageUrl, // True if the canvas contains an image
         textStyle,
         imageUrl,
         setTextStyle,
         textColor,
         setTextColor,
         fontSize,
         setFontSize,
         setFontFamily,
         fontFamily,
         textareaValue,
         setTextareaValue,
         pointsStack,
         setPointsStack,
         setWidthRange,
         widthRange,
         maxRows,
         setMaxRows,
         fieldName,
         setFieldName,
         fieldNameRef,
      }),
      [
         canvasRef,
         fieldNameRef,
         dimensions,
         imageUrl,
         textStyle,
         textColor,
         fontSize,
         fontFamily,
         textareaValue,
         pointsStack,
         widthRange,
         maxRows,
         fieldName,
      ]
   )

   const canvasProps = useMemo(
      () => ({
         height: dimensions.height,
         width: dimensions.width,
         imageUrl,
         canvasRef,
         fieldNameRef,
         fontFamily,
         fontSize,
         textColor,
         textStyle,
         textareaValue,
         setPointsStack,
         pointsStack,
         setWidthRange,
         widthRange,
         maxRows,
         setMaxRows,
         fieldName,
      }),
      [
         dimensions,
         imageUrl,
         fontFamily,
         fontSize,
         textColor,
         textStyle,
         textareaValue,
         pointsStack,
         widthRange,
         maxRows,
         fieldName,
         canvasRef,
         fieldNameRef,
      ]
   )

   return (
      <div className={style.newUpload}>
         <ToolSideBar toolSideBarProps={toolSideBarProps} />
         {imageUrl && <Canvas canvasProps={canvasProps} />}
      </div>
   )
}
