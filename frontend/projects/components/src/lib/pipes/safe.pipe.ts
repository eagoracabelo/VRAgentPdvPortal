import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    const sanitizedHtml = this.sanitizeHtml(html);
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }

  private sanitizeHtml(html: string): string {
    // Remove tags <script>, <iframe>, <embed>, <object>, etc.
    const sanitizedHtml = html?.replace(
      /<\/?(script|iframe|embed|object).*?>/gi,
      '',
    );

    // Remove atributos de eventos (onclick, onerror, etc.)
    const withoutEventAttributes = sanitizedHtml?.replace(
      /\s(on\w+)=["'][^"']*["']/gi,
      '',
    );

    // Remove atributos "href" e "src" com javascript:
    const withoutJsLinks = withoutEventAttributes?.replace(
      /\s(href|src)=["'](javascript:.*?)["']/gi,
      '',
    );

    // Remove tags <style> e <link> que podem carregar CSS malicioso
    const withoutStyles = withoutJsLinks?.replace(/<\/?(style|link).*?>/gi, '');

    // Remove atributos "style" que podem conter CSS malicioso
    const withoutInlineStyles = withoutStyles?.replace(
      /\sstyle=(["'])[^"']*?\1/gi,
      '',
    );

    return withoutInlineStyles;
  }
}
