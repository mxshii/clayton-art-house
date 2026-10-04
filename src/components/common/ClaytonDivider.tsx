import React from 'react';

interface ClaytonDividerProps {
  /** Transition direction */
  variant: 'white-to-sand' | 'sand-to-white' | 'canvas-to-sand' | 'sand-to-canvas';
  className?: string;
}

export const ClaytonDivider: React.FC<ClaytonDividerProps> = ({ variant, className = '' }) => {
  const isEnteringSand = variant === 'white-to-sand' || variant === 'canvas-to-sand';
  const fillColor = isEnteringSand
    ? '#E5D2C2'
    : variant === 'sand-to-canvas'
    ? '#F6F3EF'
    : '#FFFFFF';

  if (isEnteringSand) {
    return (
      <div className={`w-full flex justify-center overflow-hidden pointer-events-none -mb-1 ${className}`} data-svg-wrapper>
        <svg
          width="1440"
          height="70"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[35px] sm:h-[55px] lg:h-[70px] block"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M1370.57 0C1340.78 0 1315.37 13.5304 1305.5 32.5261C1295.67 13.5304 1270.26 0 1240.46 0C1210.67 0 1185.25 13.5304 1175.39 32.5261C1165.56 13.5304 1140.14 0 1110.35 0C1080.55 0 1055.14 13.5304 1045.28 32.5261C1035.44 13.5304 1010.03 0 980.237 0C950.442 0 925.03 13.5304 915.168 32.5261C905.332 13.5304 879.92 0 850.125 0C820.33 0 794.892 13.5304 785.056 32.5261C775.22 13.5304 749.808 0 720.013 0C690.218 0 664.78 13.5304 654.944 32.5261C645.108 13.5304 619.696 0 589.901 0C560.106 0 534.668 13.5304 524.832 32.5261C514.996 13.5304 489.584 0 459.789 0C429.994 0 404.556 13.5304 394.72 32.5261C384.884 13.5304 359.472 0 329.65 0C299.829 0 274.443 13.5304 264.607 32.5261C254.771 13.5304 229.359 0 199.538 0C169.717 0 144.331 13.5304 134.495 32.5261C124.659 13.5304 99.2474 0 69.4262 0C31.0996 0 0 22.3728 0 49.9889V100H1440V49.9222C1440 22.3728 1408.93 0 1370.57 0Z"
            fill={fillColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center overflow-hidden pointer-events-none -mt-1 ${className}`} data-svg-wrapper>
      <svg
        width="1440"
        height="70"
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[35px] sm:h-[55px] lg:h-[70px] block"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M1370.57 100C1340.78 100 1315.37 86.4696 1305.5 67.4739C1295.67 86.4696 1270.26 100 1240.46 100C1210.67 100 1185.25 86.4696 1175.39 67.4739C1165.56 86.4696 1140.14 100 1110.35 100C1080.55 100 1055.14 86.4696 1045.28 67.4739C1035.44 86.4696 1010.03 100 980.237 100C950.442 100 925.03 86.4696 915.168 67.4739C905.332 86.4696 879.92 100 850.125 100C820.33 100 794.892 86.4696 785.056 67.4739C775.22 86.4696 749.808 100 720.013 100C690.218 100 664.78 86.4696 654.944 67.4739C645.108 86.4696 619.696 100 589.901 100C560.106 100 534.668 86.4696 524.832 67.4739C514.996 86.4696 489.584 100 459.789 100C429.994 100 404.556 86.4696 394.72 67.4739C384.884 86.4696 359.472 100 329.65 100C299.829 100 274.443 86.4696 264.607 67.4739C254.771 86.4696 229.359 100 199.538 100C169.717 100 144.331 86.4696 134.495 67.4739C124.659 86.4696 99.2474 100 69.4262 100C31.0996 100 0 77.6272 0 50.0111V0H1440V50.0778C1440 77.6272 1408.93 100 1370.57 100Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
