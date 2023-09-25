import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { Express } from 'Express';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly _logger = new Logger(FileTypeValidationPipe.name);

  async transform(value: Express.Multer.File) {
    const { mime } = await fromBuffer(value.buffer);
    const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!MIME_TYPES.includes(mime)) {
      throw new BadRequestException(
        'The image should be either jpeg, png, or webp.',
      );
    }

    return value;
  }
}
