import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { DesignService } from './design.service';
import { DesignCreate } from './dto/design-create';
import { ResultData } from '../lib/utils/result';

@Controller('design')
export class DesignController {
  constructor(private designService: DesignService) {}
}
