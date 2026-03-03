import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlecaseSafe', standalone: true })
export class TitlecaseSafePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ');
  }
}