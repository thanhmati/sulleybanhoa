import React from 'react';
import type { LandingHeroConfig } from '@/types/store-setting';

export type TextTokenType = 'text' | 'highlight' | 'newline';

export interface TextToken {
  type: TextTokenType;
  content: string;
}

/**
 * Tokenizer Pattern: Parses text containing highlight tags ({text} or *text*) or newlines into typed tokens.
 */
export function tokenizeText(input?: string): TextToken[] {
  if (!input) return [];

  const regex = /(\r?\n|<br\s*\/?>)|(?:\{|\*)(.*?)(?:\}|\*)/gi;
  const tokens: TextToken[] = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      });
    }

    if (match[1]) {
      tokens.push({ type: 'newline', content: '\n' });
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'highlight', content: match[2] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({
      type: 'text',
      content: input.slice(lastIndex),
    });
  }

  return tokens;
}

interface FormattedTextProps {
  text?: string;
  defaultText?: string;
  highlightClassName?: string;
  showSvgUnderline?: boolean;
}

/**
 * Best Practice Component: FormattedText
 * Renders tokenized text with high-end Korean Floral Studio highlight styling.
 */
export function FormattedText({
  text,
  defaultText = 'Tô điểm {khoảnh khắc} cùng thiên nhiên.',
  highlightClassName = 'italic font-serif text-primary relative inline-block font-normal mx-1',
  showSvgUnderline = true,
}: FormattedTextProps) {
  const content = text || defaultText;
  const tokens = tokenizeText(content);

  // Fallback: If no highlight tags exist but text contains "khoảnh khắc", auto-highlight "khoảnh khắc"
  const hasHighlightToken = tokens.some((t) => t.type === 'highlight');
  if (!hasHighlightToken && content.includes('khoảnh khắc')) {
    const parts = content.split('khoảnh khắc');
    return (
      <>
        {parts[0]}
        <span className={highlightClassName}>
          khoảnh khắc
          {showSvgUnderline && (
            <svg
              className="absolute -bottom-2 left-0 w-full h-2.5 text-[#be8e8e]/50 pointer-events-none"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          )}
        </span>
        {parts[1]}
      </>
    );
  }

  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'newline') {
          return <br key={index} className="hidden sm:inline" />;
        }

        if (token.type === 'highlight') {
          return (
            <span key={index} className={highlightClassName}>
              {token.content}
              {showSvgUnderline && (
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2.5 text-[#be8e8e]/50 pointer-events-none"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              )}
            </span>
          );
        }

        return <React.Fragment key={index}>{token.content}</React.Fragment>;
      })}
    </>
  );
}

export function renderFormattedTitle(
  title?: string,
  defaultTitle = 'Tô điểm {khoảnh khắc} cùng thiên nhiên.',
): React.ReactNode {
  return <FormattedText text={title} defaultText={defaultTitle} />;
}

export function renderHeroTitle(hero?: LandingHeroConfig): React.ReactNode {
  if (hero?.titlePrefix || hero?.titleHighlight || hero?.titleSuffix) {
    const combined = `${hero.titlePrefix || 'Tô điểm'} {${hero.titleHighlight || 'khoảnh khắc'}} ${hero.titleSuffix || 'cùng thiên nhiên.'}`;
    return <FormattedText text={combined} />;
  }

  return <FormattedText text={hero?.title} />;
}
