import type { Icon, IconProps } from 'react-bootstrap-icons';

import styles from './Logo.module.scss';

const LOGO_SIZES = [16, 32, 48, 64, 180, 192, 220, 512, 800] as const;

const logoSrc = (edge: number): string => `/images/new-logos/puzzles-${edge}x${edge}.webp`;

const parseSizeToPx = (size: IconProps['size']): number => {
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }

  if (typeof size === 'string') {
    const value = size.trim().toLowerCase();
    const amount = Number.parseFloat(value);
    if (!Number.isFinite(amount)) {
      return 16;
    }
    if (value.endsWith('rem') || value.endsWith('em')) {
      return amount * 16;
    }
    return amount;
  }

  return 16;
};

const pickLogoEdge = (px: number): number => {
  const match = LOGO_SIZES.find((edge) => edge >= px);
  return match ?? LOGO_SIZES[LOGO_SIZES.length - 1];
};

const Logo: Icon = ({ size = '1em', className = '', title }) => {
  const displaySize = size ?? '1em';
  const px = parseSizeToPx(displaySize);
  const edge = pickLogoEdge(px);
  const retinaEdge = pickLogoEdge(px * 2);
  const src = logoSrc(edge);
  const srcSet = retinaEdge > edge ? `${src} 1x, ${logoSrc(retinaEdge)} 2x` : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      width={edge}
      height={edge}
      alt={title ?? 'Puzzles'}
      className={`${styles.Logo} ${className}`.trim()}
      style={{ width: displaySize, height: displaySize }}
      draggable={false}
    />
  );
};

export default Logo;
