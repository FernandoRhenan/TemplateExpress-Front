export default function errorResponse({
   data = null,
   message = 'Ocorreu um erro inesperado.',
   errorName = 'internal',
   action = 'Tente novamente mais tarde',
   statusCode = 500,
}) {
   return { message, errorName, action, statusCode, data, error: true }
}
