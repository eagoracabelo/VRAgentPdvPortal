export interface Holiday {
  kind?: string;
  etag?: string;
  id?: string;
  status?: string;
  htmlLink?: string;
  created?: string;
  updated?: string;
  summary?: string;
  start: { date: string };
  end: { date?: string };
  transparency?: string;
  visibility?: string;
  iCalUID?: string;
  sequence?: number;
}
