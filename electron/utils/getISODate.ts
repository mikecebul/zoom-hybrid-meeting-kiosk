export function getISODate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Extract YYYY-MM-DD part
  }