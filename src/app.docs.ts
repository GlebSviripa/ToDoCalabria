export function errorCodesDescriptions(): string {
    return `
      --- Possible Errors --- \n
      ForbiddenResponse: { error: 'forbidden', message: 'Missing permissions' } \n
      UnauthorizedResponse: { error: 'unauthorized', message: 'User is not authorized' } \n
      BadRequestResponse: { error: 'validation', message: 'Validation error' } \n
      NotFoundResponse: { error: 'not_exists', message: 'Entity not found' } \n
      InternalServerErrorResponse: { error: 'internal', message: 'Internal server error' } \n
      InternalServerErrorResponse: { error: 'unknown', message: 'Unknown error' }
    `;
}
