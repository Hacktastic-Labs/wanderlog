/**
 * Dark-mode-first auth color palette.
 *
 * The auth screens use a simple black background with white text and inputs.
 */

export const AuthColors = {
  /** Page background */
  background: '#000000',
  /** Primary text and filled buttons */
  foreground: '#ffffff',
  /** Inverse text on dark surfaces */
  foregroundInverse: '#000000',
  /** Muted labels and secondary text */
  muted: '#8e8e93',
  /** Borders and dividers */
  border: '#333333',
  /** Input field backgrounds */
  input: '#1c1c1e',
  /** Error states */
  error: '#ff453a',
  /** Disabled / loading state opacity overlay */
  disabledOverlay: 'rgba(0, 0, 0, 0.4)',
} as const;

export type AuthColor = keyof typeof AuthColors;
