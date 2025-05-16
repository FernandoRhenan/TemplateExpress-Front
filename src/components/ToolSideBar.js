import style from 'src/components/toolSideBar.module.css'
import { BiSave, BiUpload, /* BiUndo, BiRedo, */ BiTrash } from 'react-icons/bi'
import { GoQuestion } from 'react-icons/go'
import { fontsArray } from 'src/utils/front/fonts'
import getImageProps from 'src/utils/front/getImageProps'
import { toast } from 'react-hot-toast'
import errorResponse from '@/utils/response/errorResponse'
import { useRef } from 'react'
// import downloadImageFromCanvas from 'src/utils/downloadImageFromCanvas'

function ToolSideBar({ toolSideBarProps: p }) {
   const inputFileRef = useRef(null)

   // Active when user change a file on input.
   const handleImageChange = async () => {
      const { width, height, img } = await getImageProps(inputFileRef.current.files[0])
      p.setImageUrl(img)
      p.setDimensions({ width, height })
      p.setPointsStack([])
   }

   const handleChangeTextStyle = (e) => {
      // Selects the only field that should be toggled
      p.setTextStyle({
         ...p.textStyle,
         [e.target.id]: !p.textStyle[e.target.id],
      })
   }

   const handleChangeTextColor = (e) => {
      p.setTextColor(e.target.value)
   }

   const handleChangeFontSize = (e) => {
      p.setFontSize(e.target.value)
   }

   const handleChangeFontFamily = (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex]

      // Used for apply the font family on <Canvas>
      p.setFontFamily({
         fontFamily: selectedOption.getAttribute('data-fontfamily'),
         fontClassname: selectedOption.getAttribute('data-classname'),
      })
   }

   const handleChangeTextareaValue = (e) => {
      p.setTextareaValue(e.target.value)
   }

   const handleChangeWidthRange = (e) => {
      p.setWidthRange(parseInt(e.target.value))
   }

   const handleChangeMaxRows = (e) => {
      p.setMaxRows(parseInt(e.target.value))
   }

   const handleChangeFieldName = (e) => {
      p.setFieldName(e.target.value)
   }

   const infoField = (text) => {
      toast(text, {
         duration: 5000,
      })
   }

   const clearCanvas = () => {
      if (p.canvasRef.current != null) {
         const ctx = p.canvasRef.current.getContext('2d')
         ctx.clearRect(0, 0, p.width, p.height)
         ctx.drawImage(p.imageUrl, 0, 0)
         p.setPointsStack([])
      }
   }

   const handleSaveImage = async () => {
      if (p.pointsStack.length === 0) {
         toast.error('Escolha pelo menos um ponto para salvar o template!')
      }
      const userId = 1
      try {
         const formData = new FormData()

         formData.append('userId', userId)
         formData.append('width', p.width)
         formData.append('height', p.height)
         formData.append('pointsStack', JSON.stringify(p.pointsStack))
         formData.append('image', inputFileRef.current.files[0])

         const res = await fetch(`http://localhost:8080/api/template`, {
            method: 'POST',
            body: formData,
         })

         const data = await res.json()

         if (data.statusCode === 201) {
            toast.success(data.message)
            // Redireciona para os templates
         }
      } catch (err) {
         toast.error(errorResponse({}).message)
      }
   }

   return (
      <div className={style.toolSideBar}>
         <div className={style.upperArea}>
            <label className={style.uploadArea} onChange={handleImageChange}>
               <input type="file" ref={inputFileRef} />
               <div>
                  <span>
                     <BiUpload />{' '}
                  </span>
                  <span>Subir imagem</span>
               </div>
            </label>

            <div className={style.editionArea}>
               <span className={style.referenceText}>Área de edição</span>

               <div className={`${style.timelineBar} ${style.genericArea}`}>
                  {/* <span>
                     <BiUndo />
                  </span>
                  <span>
                     <BiRedo />
                  </span> */}
                  <span onClick={clearCanvas} title="Excluir marcações">
                     <BiTrash />
                  </span>
               </div>

               <div className={style.inputArea}>
                  <label>
                     <div className={style.questionContainer}>
                        <span>Nome do campo:</span>
                        <span
                           style={{ cursor: 'pointer' }}
                           onClick={() => {
                              infoField(
                                 'Serve como referência para um ponto escolhido na imagem.\n\nÉ importante para identificar com facilidade as areas de texto na hora de preencher-las.'
                              )
                           }}
                        >
                           <GoQuestion />
                        </span>
                     </div>
                     <input
                        ref={p.fieldNameRef}
                        type="text"
                        value={p.fieldName}
                        onChange={handleChangeFieldName}
                     />
                  </label>
               </div>

               <ul className={style.toolsGrid}>
                  <li
                     className={style.bold}
                     id="bold"
                     onClick={handleChangeTextStyle}
                     style={p.textStyle.bold ? { backgroundColor: 'var(--rd-asset-color)' } : {}}
                  >
                     B
                  </li>
                  <li
                     className={style.italic}
                     id="italic"
                     onClick={handleChangeTextStyle}
                     style={p.textStyle.italic ? { backgroundColor: 'var(--rd-asset-color)' } : {}}
                  >
                     i
                  </li>
                  {/* <li className={style.underline} id='underline' onClick={handleChangeTextStyle} style={p.textStyle.underline ? { backgroundColor: 'var(--rd-asset-color)' } : {}}>U</li> */}
                  {/* <li className={style.lineThrough} id='lineThrough' onClick={handleChangeTextStyle} style={p.textStyle.lineThrough ? { backgroundColor: 'var(--rd-asset-color)' } : {}}>LT</li> */}
               </ul>

               <div className={style.genericArea}>
                  <span>Fonte:</span>

                  <select
                     onChange={handleChangeFontFamily}
                     className={`${p.fontFamily.fontClassname} ${style.selectFontFamily}`}
                  >
                     {/* List the fonts array */}
                     {fontsArray.map((item, i) => (
                        <option
                           key={i}
                           className={item.font.className}
                           data-fontfamily={item.font.style.fontFamily}
                           data-classname={item.font.className}
                        >
                           {item.name}
                        </option>
                     ))}
                  </select>
               </div>

               <div className={style.genericArea}>
                  <span>Tamanho da fonte:</span>
                  <select
                     className={style.smallerSelect}
                     defaultValue={p.fontSize}
                     onChange={handleChangeFontSize}
                  >
                     <option>6</option>
                     <option>8</option>
                     <option>10</option>
                     <option>12</option>
                     <option>14</option>
                     <option>16</option>
                     <option>18</option>
                     <option>22</option>
                     <option>26</option>
                     <option>30</option>
                     <option>36</option>
                     <option>42</option>
                     <option>50</option>
                     <option>58</option>
                     <option>68</option>
                     <option>78</option>
                     <option>90</option>
                  </select>
               </div>

               <div className={style.genericArea}>
                  <span>Cor da fonte:</span>
                  <input type="color" onChange={handleChangeTextColor} value={p.textColor} />
               </div>

               <div ref={p.textareaRef} className={style.inputArea}>
                  <label>
                     <div className={style.questionContainer}>
                        <span>Texto exemplo:</span>
                        <span
                           style={{ cursor: 'pointer' }}
                           onClick={() => {
                              infoField(
                                 'Serve como pré-visualização do conteúdo da área.\n\nNão será o valor definitivo do campo, apenas uma exemplificação.'
                              )
                           }}
                        >
                           <GoQuestion />
                        </span>
                     </div>
                     <textarea
                        onChange={handleChangeTextareaValue}
                        value={p.textareaValue}
                     ></textarea>
                  </label>
               </div>

               <div ref={p.widthInputRef} className={style.inputArea}>
                  <label>
                     <span>Largura máxima:</span>
                     <input
                        type="range"
                        min="6"
                        max={p.width}
                        value={p.widthRange}
                        onChange={handleChangeWidthRange}
                     />
                  </label>
               </div>

               <div className={style.genericArea}>
                  <span>Máximo de linhas:</span>
                  <select
                     className={style.smallerSelect}
                     defaultValue={p.maxRows}
                     onChange={handleChangeMaxRows}
                  >
                     <option>1</option>
                     <option>2</option>
                     <option>3</option>
                     <option>4</option>
                     <option>5</option>
                     <option>6</option>
                     <option>7</option>
                     <option>8</option>
                     <option>9</option>
                     <option>10</option>
                     <option>11</option>
                     <option>12</option>
                     <option>13</option>
                     <option>14</option>
                     <option>15</option>
                     <option>16</option>
                     <option>17</option>
                     <option>18</option>
                     <option>19</option>
                     <option>20</option>
                  </select>
               </div>
            </div>
         </div>
         <div className={style.lowerArea}>
            <div className={style.viewArea}>
               <span className={style.referenceText} style={{ marginTop: 'var(--margin2)' }}>
                  Área de visualização
               </span>
               <div className={style.fieldNameArea}>
                  <span>Campos marcados:</span>
                  <ul className={style.pointsView}>
                     {p.pointsStack.map((item, i) => (
                        <li key={i}>
                           {i + 1} - {item.fieldName}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <button className={style.savedButton} onClick={handleSaveImage}>
               <span>
                  <BiSave />
               </span>
               <span>Salvar Template</span>
            </button>
            {/* <button
               className={style.savedButton}
               style={
                  p.hasImage ? { cursor: 'pointer' } : { cursor: 'not-allowed' }
               }
               onClick={handleDownload}
               disabled={p.hasImage ? false : true}
            >
               <span>
                  <BiDownload />
               </span>
               <span>Baixar imagem</span>
            </button> */}
         </div>
      </div>
   )
}

export default ToolSideBar
