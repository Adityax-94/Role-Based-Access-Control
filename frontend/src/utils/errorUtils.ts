import axios from 'axios';

/**
 * Extracts a human-readable error message from Axios errors or generic errors.
 * Handles the nested `data.message` structure returned by the Spring Boot ApiResponse.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server returned a structured ApiResponse error
    const serverMessage = error.response?.data?.message;
    if (serverMessage) return serverMessage;

    // Validation errors map
    const serverData = error.response?.data?.data;
    if (serverData && typeof serverData === 'object') {
      const messages = Object.values(serverData).join(', ');
      if (messages) return messages;
    }

    // HTTP-level error
    if (error.response?.status === 401) return 'Invalid email or password.';
    if (error.response?.status === 403) return 'You do not have permission to perform this action.';
    if (error.response?.status === 409) return 'This email address is already registered.';
    if (error.response?.status === 500) return 'Server error. Please try again later.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please check your connection.';
    if (!error.response) return 'Cannot connect to server. Is the backend running?';
  }

  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred. Please try again.';
}
