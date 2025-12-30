
export type DressType = 'Formal Suit' | 'White Shirt' | 'Blue Shirt' | 'Panjabi' | 'Saree' | 'Black Blazer' | 'No Change';

export interface EditorConfig {
  bgColor: string;
  dressType: DressType;
  enhanceFace: boolean;
  smoothSkin: boolean;
  lightingAdjustment: 'Normal' | 'Bright' | 'Studio' | 'Auto-Fix';
}
