import { ComponentRef, Type } from '@angular/core';

export interface WindowConfig {
  id: string;
  title: string;
  component: Type<any>;
  data?: any;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
  closable?: boolean;
  minimizable?: boolean;
  position?: WindowPosition;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isCentered: boolean;
  isVisible: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  previousPosition?: WindowPosition;
  previousSize?: WindowSize;
  component: Type<any>;
  componentRef?: ComponentRef<any>;
  data?: any;
  config: WindowConfig;
}

export interface WindowResult {
  action: 'close' | 'minimize' | 'maximize' | 'restore' | 'center' | 'data';
  data?: any;
}

export interface DynamicComponentInterface {
  windowData?: any;
  onWindowClose?: (data?: any) => void;
  onWindowMinimize?: () => void;
  onWindowMaximize?: () => void;
}
