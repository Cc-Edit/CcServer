import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANON = 'allowAccess';
/**
 * 允许 接口 不校验 token
 */
export const AllowAccess = () => SetMetadata(ALLOW_ANON, true);
