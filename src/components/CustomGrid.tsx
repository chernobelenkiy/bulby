'use client';

import { ReactNode } from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type GridItemProps = {
  children: ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  item?: boolean;
  container?: boolean;
  spacing?: number;
  alignItems?: string;
  sx?: SxProps<Theme>;
};

export function Grid({ children, ...props }: GridItemProps) {
  return <MuiGrid {...props}>{children}</MuiGrid>;
}

export function GridItem({ children, ...props }: GridItemProps) {
  return <MuiGrid item {...props}>{children}</MuiGrid>;
}

export function GridContainer({ children, ...props }: GridItemProps) {
  return <MuiGrid container {...props}>{children}</MuiGrid>;
} 