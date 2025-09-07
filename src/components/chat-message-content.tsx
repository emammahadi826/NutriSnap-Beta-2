
"use client";

import React from 'react';

// Props for the component
interface ChatMessageContentProps {
  content: string;
}

// Helper to parse bold/italic text within a line
const parseInlineFormatting = (line: string) => {
  // Regex to find **bold**, *italic*, and `code`
  const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(`(.*?)`)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    
    // Check which group was matched and apply styling
    if (match[2]) { // Bold: **text**
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[4]) { // Italic: *text*
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[6]) { // Code: `text`
       parts.push(<code key={match.index} className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-sm font-mono">{match[6]}</code>);
    }
    
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
};


// Main component to render the parsed message
export function ChatMessageContent({ content }: ChatMessageContentProps) {
  const lines = content.split('\n');

  const elements = lines.map((line, index) => {
    // Headings
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-4 mb-2">{parseInlineFormatting(line.substring(2))}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-4 mb-2 border-b pb-1">{parseInlineFormatting(line.substring(3))}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{parseInlineFormatting(line.substring(4))}</h3>;
    }

    // Unordered List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={index} className="ml-6 list-disc">{parseInlineFormatting(line.substring(2))}</li>;
    }
    
    // Ordered List
    const olMatch = line.match(/^(\d+)\.\s/);
    if (olMatch) {
       return <li key={index} className="ml-6" value={parseInt(olMatch[1], 10)} style={{listStyleType: 'decimal'}}>{parseInlineFormatting(line.substring(olMatch[0].length))}</li>
    }

    // Blockquote
    if (line.startsWith('> ')) {
      return (
        <blockquote key={index} className="border-l-4 border-muted-foreground/50 pl-4 italic my-2">
          {parseInlineFormatting(line.substring(2))}
        </blockquote>
      );
    }
    
    // Divider
    if (line.match(/^---\s*$/)) {
        return <hr key={index} className="my-4 border-border" />;
    }

    // Normal paragraph (handles empty lines as vertical space)
    return <p key={index} className={line.trim() === '' ? 'h-4' : ''}>{parseInlineFormatting(line)}</p>;
  });

  return <div className="prose prose-sm dark:prose-invert max-w-none">{elements}</div>;
}
