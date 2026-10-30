import React from 'react';

const positions: Record<string, string> = { pump: '0% 0%', filter: '50% 0%', robot: '100% 0%', light: '0% 100%', skimmer: '50% 100%', fittings: '100% 100%' };

/** One catalog sheet displayed as individual product tiles without duplicating assets. */
export const PoolImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt = '', className, ...props }) => {
  if (src?.includes('pool-equipment.png#')) {
    const [url, tile] = src.split('#');
    return <span role="img" aria-label={alt} className={`pool-equipment-image ${className || ''}`} style={{ backgroundImage: `url("${url}")`, backgroundPosition: positions[tile] || '0% 0%' }} />;
  }
  return <img src={src} alt={alt} className={className} {...props} />;
};
