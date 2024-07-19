import { getMarkdownFiles } from '../../lib/markdown';

export default async function handler(req, res) {
  const entries = await getMarkdownFiles('til');
  res.status(200).json(entries);
}