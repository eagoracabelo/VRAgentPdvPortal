export abstract class MarkdownCommon {
  onLoad(event: Event): void {
    console.log(event);
  }

  onError(event: Event): void {
    console.error(event);
  }
}
