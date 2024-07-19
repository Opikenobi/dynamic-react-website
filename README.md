# Building a responsive Website with Next.js
2024-07-19

## Introduction

I've never been that much into Webdevelopment, I know how to build stuff, I know a few Frameworks, but I still was working strongly with PHP and never touched more modern approaches like React and Next.js respectively. But due to the fact that Websites are the frontface of the internet, I decided it is time to get into the magical world of React.js and build my Website around it. I'm still a complete noob with CSS so many of the stuff I did in CSS is powered by ChatGPT, so please don't sue me. 

In this article, I'll walk you through the process of building this website using Next.js. The website is responsive and includes various sections which are populated on the fly using contents from Markdown files. The Markdown is rendered like it should be. So this website can be used like a CMS, without the CMS!

This website consists of various sections
- `Home`: This will be our landing page
- `About me`: Could be anything else, but as this is my website I would like to have a section to introduce myself
- `Blog & Advisories`: Where I can put articles, Today I Learned posts and Security Advisories
- `Contact`: How you can contact me

## Project Setup

First, let's create a new Next.js project. Open your terminal and run:

```bash
npx create-next-app my-website
cd my-website
```

And install all the required packages
```bash
npm install fs path remark remark-html remark-parse rehype rehype-highlight rehype-raw remark-gfm unified
```

But what are these packages for you'd ask?

- `fs` and `path` are for filesystem operations like opening files and navigating to specific paths
- `remark-*` enables us to parse Markdown files
- `rehype-*` gives us syntax highlighting 
- `unified` enables us to use remark and rehype together!

## Directory Structure
Here's an overview of the project structure:

```
my-website/
├── blog/
│   ├── first-post.md
│   └── ...
├── til/
│   ├── first-entry.md
│   └── ...
├── advisories/
│   ├── first-advisory.md
│   └── ...
├── content/
│   ├── home.md
│   ├── about.md
│   └── contact.md
├── lib/
│   └── markdown.js
├── pages/
│   ├── api/
│   │   ├── blog.js
│   │   ├── til.js
│   │   └── advisories.js
│   ├── blog/
│   │   └── [post].js
│   ├── til/
│   │   └── [entry].js
│   ├── advisories/
│   │   └── [advisory].js
│   ├── components/
│   │   └── Layout.js
│   ├── _app.js
│   ├── index.js
│   ├── about.js
│   ├── contact.js
├── public/
│   └── background.jpg
├── styles/
│   ├── global.css
│   └── highlight.css
├── package.json
└── next.config.js
```

## Populating content

To populate the pages `index.js`, `about.js` and `contact.js` go into the folder `content`. You can write everything in markdown and it gets parsed correctly automatically.

`content/home.md`: This populates `index.js`
`content/about.md`: This populates `about.js`
`content/contact.md`: This populates `about.js`

To populate the Contents of `Blog & TIL` go into the folder `blog` or `til` respectively in the root folder. And create a .md file. The first line of the markdown document gets used as a title and the second as date which will be used to populate the list under `Blog & TIL`.

## Changing the Navbar or the Layout

The Navbar can be changed under `/pages/components/Navbar.js` here you can add or remove Pages. Make sure to add/delteroutes and dynamic routes accordingly.

The Title of the page can be changed under `/pages/components/Layout.js`


---
# About the Code

## Parsing Markdown Files

Let's create a utility to parse markdown files and extract the necessary metadata title and date for `Blog & Advisories`.

This will either read a single file (`getMarkdownContent`), pass it to the parser (`parseMarkdownFile`) and return the parsed markdown as HTML or reads a folder (`getMarkdownFiles`) and returning the first line as title, the second line as date and the filename without the filetype. 

File: **lib/markdown.js**

```javascript
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
```

## Creating Pages

We will create index, about, and contact pages and populate them using markdown files.

File: **content/home.md**
```markdown
# Welcome to My Website

---

Welcome to my personal website. Here you'll find my blog posts, Today I Learned entries, advisories, and more. Explore and enjoy!
```

File: **pages/index.js**
```javascript
import Layout from './components/Layout';
import { getMarkdownContent } from '../lib/markdown';

const Home = ({ contentHtml }) => {
  return (
    <Layout pageTitle="Home">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export async function getStaticProps() {
  const { contentHtml } = await getMarkdownContent('home.md');
  return { props: { contentHtml } };
}

export default Home;
```

## Creating API Routes

Let's create API routes to fetch the metadata for blog posts, TIL entries, and advisories.

This returns a JSON list with the title, date and filename without filetype of all the files in the given folder.

As an example I am only showing it here for one API route it is the same for all.

File: **pages/api/blog.js**

```javascript
import { getMarkdownFiles } from '../../lib/markdown';

export default async function handler(req, res) {
  const posts = await getMarkdownFiles('blog');
  res.status(200).json(posts);
}
```
## Creating Dynamic Routes for Individual Entries

As an example I am only showing it here for one dynamic route it is the same for all.

This takes the given file, passes the content of it to `parseMarkdownFile` from before and renders the content in HTML

File: **pages/blog/[post].js**

```javascript
import fs from 'fs';
import path from 'path';
import { parseMarkdownFile } from '../../lib/markdown';
import Layout from '../components/Layout';

export async function getStaticPaths() {
  const dirPath = path.join(process.cwd(), 'blog');
  const filenames = fs.readdirSync(dirPath);

  const paths = filenames.map((filename) => ({
    params: { post: filename.replace(/\.md$/, '') }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'blog', `${params.post}.md`);
  const { title, contentHtml } = await parseMarkdownFile(filePath);

  return { props: { post: params.post, title, contentHtml } };
}

const Post = ({ title, contentHtml }) => {
  return (
    <Layout pageTitle={title}>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export default Post;
```

## Creating the Page for Blog & Advisories

This is the page which shows all available entries for the existing Blog, TIL and Advisories Posts.

It read the respective apis for blog, til and advisories and lists them in their section as a hyperlink to the dynamic route.

```javascript
import { useEffect, useState } from 'react';
import Layout from './components/Layout';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [advisories, setAdvisories] = useState([]);

  useEffect(() => {
    // Fetch blog posts
    fetch('/api/blog')
      .then((response) => response.json())
      .then((data) => setPosts(data));

    // Fetch TIL entries
    fetch('/api/til')
      .then((response) => response.json())
      .then((data) => setEntries(data));

    // Fetch advisories
    fetch('/api/advisories')
      .then((response) => response.json())
      .then((data) => setAdvisories(data));
  }, []);

  return (
    <Layout pageTitle="Blog">
      <h2>Blog</h2>
      <hr></hr>
      <ul className="blog-list">
      {posts.map((post) => (
           <li key={post.slug}>
           <a href={`/blog/${post.slug}`}>{post.date} - {post.title}</a>
         </li>
        ))}
      </ul>

      <h2>TIL</h2>
      <hr></hr>
      <ul className="til-list">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <a href={`/til/${entry.slug}`}>{entry.date} - {entry.title}</a>
          </li>
        ))}
      </ul>

      <h2>Advisories</h2>
    <hr></hr>
      <ul className="advisory-list">
        {advisories.map((advisory) => (
          <li key={advisory.slug}>
            <a href={`/advisories/${advisory.slug}`}>
              {advisory.date} - {advisory.title}
            </a>
          </li>
        ))}
      </ul>
      
    </Layout>
  );
};

export default Blog;
```

## Conclusion

React.js is a pretty powerful framework for Webdevelopment. I built this page with my rudimentary knowledge in Javascript from scratch (with a little help from ChatGPT and Stackoverflow) in more or less 1 1/2 days which is pretty fast in my opinion. Im sure there are potentials to refactor and optimize stuff. And I'm sure that will be something I will do in the future but not now.

## Additonal Sources

The general CSS file: [globals.css ](../globals.css)

CSS for syntax highlighting: [highlight.css ](../highlight.css)

[Github Repository (ToDo)]()