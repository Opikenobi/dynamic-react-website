import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export async function getMarkdownContent(filename) {
  const filePath = path.join(process.cwd(), 'content', filename);
  const content = await parseMarkdownFile(filePath);
  return content;
}

export async function getMarkdownFiles(directory) {
  const dirPath = path.join(process.cwd(), directory);
  const filenames = fs.readdirSync(dirPath);

  const files = await Promise.all(filenames.map(async (filename) => {
    const filePath = path.join(dirPath, filename);
    const { title, date } = await parseMarkdownFile(filePath);
    return {
      title,
      date,
      slug: filename.replace(/\.md$/, ''),
    };
  }));

  return files;
}


  export async function parseMarkdownFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lines = fileContents.split('\n');
    const title = lines[0].replace(/^# /, ''); // First line as title
    const date = lines[1]; // Second line as date
  
    const processedContent = await unified()
      .use(gfm)
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .use(rehypeRaw) // Process raw HTML
      .process(fileContents);
  
    return {
      title,
      date,
      contentHtml: processedContent.toString()
    };
  }
