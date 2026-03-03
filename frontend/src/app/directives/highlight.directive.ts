import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective implements OnChanges {
  @Input() appHighlight = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    this.el.nativeElement.style.fontWeight = this.appHighlight ? '600' : '400';
  }
}