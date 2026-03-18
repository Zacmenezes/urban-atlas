import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../api/api.config';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url) || req.url.startsWith('/assets/')) {
    return next(req);
  }

  const baseUrl = inject(API_BASE_URL).replace(/\/$/, '');
  const normalizedPath = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(req.clone({ url: `${baseUrl}${normalizedPath}` }));
};

