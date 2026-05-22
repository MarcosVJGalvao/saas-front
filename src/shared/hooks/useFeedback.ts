import { useState } from 'react';

export type FeedbackMessage = { type: 'success' | 'error'; text: string };

export const useFeedback = () => {
  const [message, setMessage] = useState<FeedbackMessage | undefined>(undefined);

  return {
    message,
    setSuccess: (text: string) => setMessage({ type: 'success', text }),
    setError: (text: string) => setMessage({ type: 'error', text }),
    clear: () => setMessage(undefined),
  };
};
