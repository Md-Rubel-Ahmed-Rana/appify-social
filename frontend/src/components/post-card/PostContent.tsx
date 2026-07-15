'use client';

import { useEffect, useRef, useState } from 'react';
import { Post } from '@/types/post.type';
import { cn } from '@/lib/utils';

type Props = {
  content: Post['content'];
};

const COLLAPSED_HEIGHT = 280;

const PostContent = ({ content }: Props) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    setIsCollapsible(element.scrollHeight > COLLAPSED_HEIGHT);
  }, [content]);

  return (
    <div>
      <div className="relative">
        <p
          ref={textRef}
          className={cn(
            'overflow-hidden whitespace-pre-wrap wrap-break-word text-[15px] leading-7 transition-all duration-300',
            !expanded && 'max-h-70',
          )}
        >
          {content}
        </p>

        {!expanded && isCollapsible && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-background via-background/80 to-transparent" />
        )}
      </div>

      {isCollapsible && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default PostContent;
