import type { Params } from 'react-router-dom';

export interface BreadcrumbHandle {
  breadcrumb?: string | ((match: { params: Params<string>; pathname: string }) => string);
}
