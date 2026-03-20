```typescript
/**
 * Basic email validation regex.
 * Not perfect for all edge cases but covers most common formats.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const isUUID = (uuid: string): boolean => {
  // Basic UUID v4 regex
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return UUID_REGEX.test(uuid);
};

/**
 * Validates a string to ensure it's not null, undefined, or just whitespace.
 * @param value The string to validate.
 * @returns True if the string is valid, false otherwise.
 */
export const isNonEmptyString = (value: string | null | undefined): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};
```