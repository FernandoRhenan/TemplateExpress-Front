export function timestampFromNow(date) {
   try {
      return date.toISOString().replace('T', ' ').substring(0, 19)
   } catch (err) {
      console.error('timestamps:', err)
   }
}

export function timestampPlus24HoursFromNow(date) {
   try {
      const newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      return newDate.toISOString().replace('T', ' ').substring(0, 19)
   } catch (err) {
      console.error('timestamps:', err)
   }
}

export function getTimestamp(timestamp) {
   return new Date(timestamp + 'Z')
}

export const timestampRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/
