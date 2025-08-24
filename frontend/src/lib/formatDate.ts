export const formatDate = (isoString?: string): string => {
    if (!isoString) return '';

    const date = new Date(isoString);
    
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };