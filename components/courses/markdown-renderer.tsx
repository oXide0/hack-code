'use client';

import { useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Box } from '@chakra-ui/react';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        const processMarkdown = async () => {
            const result = await unified()
                .use(remarkParse) // Parse markdown
                .use(remarkGfm) // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
                .use(remarkRehype) // Convert to HTML AST
                .use(rehypeSanitize) // Sanitize HTML for security
                .use(rehypeHighlight, {
                    // Syntax highlighting
                    ignoreMissing: true,
                    aliases: { python: ['py'] }
                })
                .use(rehypeStringify) // Convert AST to HTML string
                .process(content);

            setHtml(result.toString());
        };

        processMarkdown();
    }, [content]);

    return <Box maxW='none' dangerouslySetInnerHTML={{ __html: html }} />;
}
