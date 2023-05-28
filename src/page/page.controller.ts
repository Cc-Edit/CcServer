import { Controller } from '@nestjs/common';
import { PageService } from "./page.service";

@Controller('page')
export class PageController {
  constructor(private pageService: PageService) {}
}
