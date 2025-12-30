
import { DressType } from './types';

export const DRESS_OPTIONS: DressType[] = [
  'No Change',
  'Formal Suit',
  'Black Blazer',
  'White Shirt',
  'Blue Shirt',
  'Panjabi',
  'Saree'
];

export const PRESET_BG_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Classic Blue', value: '#3B82F6' },
  { name: 'Sky Blue', value: '#BAE6FD' },
  { name: 'Soft Gray', value: '#E5E7EB' },
];

export const SYSTEM_PROMPT = `As a professional photo editor, generate a high-quality Bangladeshi passport size photo (40mm x 50mm).
Ensure the person is front-facing, centered, and eyes are at the upper third level. 
Apply the following specific modifications based on user input:`;
