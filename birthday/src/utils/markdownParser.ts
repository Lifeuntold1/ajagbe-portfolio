import { BookData, BookPage } from '../types/book';

export class MarkdownParser {
  static parseMarkdown(markdown: string): BookData {
    // 26 pages: Front Cover, Page 1 - 24, Back Cover
    const sections = markdown.split(/### \*\*(.*?)\*\*/g).filter(s => s.trim().length > 0);
    // sections will be an array like:
    // ["Front Cover", "\n\nWelcome to Chapter 24...", "Page 1", "\n\nDESIGN EXCERPT: Welcome to 24\n...", ...]

    const pages: BookPage[] = [];
    let pageId = 0;

    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i].trim();
      const content = sections[i + 1]?.trim() || '';

      // Determine page number: Front cover = 0, Page X = X, Back cover = 25
      let pageNumber = 0;
      if (title.startsWith('Page ')) {
        pageNumber = parseInt(title.replace('Page ', ''), 10);
      } else if (title === 'Back Cover') {
        pageNumber = 25;
      }

      pages.push({
        id: pageId++,
        pageNumber,
        title,
        content: this.formatContent(content),
      });
    }

    return {
      title: 'Chapter 24',
      subtitle: 'A digital flipbook',
      author: 'Unknown',
      pages,
      chapters: [],
      totalPages: pages.length
    };
  }

  private static formatContent(content: string): string {
    // Handle the specific formatting requested:
    // DESIGN EXCERPT: -> primary h1
    let formatted = content.replace(/^DESIGN EXCERPT:\s*(.+)$/gm, '<h1 class="text-3xl md:text-4xl font-serif text-slate-800 font-bold mb-6">$1</h1>');
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    
    // Scriptures (starting with *)
    formatted = formatted.replace(/^\*\s+(.+)$/gm, '<p class="text-sm italic font-serif text-slate-600 my-1 pl-4 border-l-2 border-slate-300">$1</p>');

    // Remaining lines -> paragraphs
    const lines = formatted.split('\n');
    
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // If it's already an HTML tag (h1, p), return as is
      if (trimmed.startsWith('<h1') || trimmed.startsWith('<p class="text-sm')) {
        return trimmed;
      }
      
      return `<p class="mb-4 leading-relaxed font-sans text-slate-700">${trimmed}</p>`;
    });

    return processedLines.filter(line => line.length > 0).join('\n');
  }
}