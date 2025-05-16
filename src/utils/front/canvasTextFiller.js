export default function canvasTextFiller(
   text,
   ctx,
   cx,
   cy,
   baseBoxHeight,
   fontBoundingBoxDescent,
   maxRows
) {
   text.forEach((text, i) => {
      if (i < 1) {
         // + baseBoxHeight to the text to be aligned with the center of the Y axis when drawn.
         ctx.fillText(text, cx, cy)
      }

      if (i >= 1 && i < maxRows) {
         ctx.fillText(text, cx, cy + (baseBoxHeight + parseInt(fontBoundingBoxDescent)) * i)
      }
   })
}
