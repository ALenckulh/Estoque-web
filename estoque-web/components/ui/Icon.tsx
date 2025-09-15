import { icons, LucideProps } from 'lucide-react';
import React from 'react';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 18, 
  ...props 
}) => {
  const fallbackIconName: keyof typeof icons = 'TriangleAlert';
  const LucideIcon = icons[name] || icons[fallbackIconName];
  
  return (
    <LucideIcon 
      size={size}
      {...props}
    />
  );
};