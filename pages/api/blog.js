import { getMarkdownFiles } from '../../lib/markdown';

export default async function handler(req, res) {
  const posts = await getMarkdownFiles('blog');
  res.status(200).json(posts);
}