'use client';

import { motion } from 'motion/react';

import type { AktualnoscItem } from '@/lib/aktualnosci/data';

import AktualnosciPostCard from './AktualnosciPostCard';

type AktualnosciBlogListProps = {
  posts: AktualnoscItem[];
};

export default function AktualnosciBlogList({ posts }: AktualnosciBlogListProps) {
  const featuredPosts = posts.slice(0, 3);
  const standardPosts = posts.slice(3);

  return (
    <div className="space-y-10 md:space-y-14">
      {featuredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
          {featuredPosts[0] ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[360px] lg:min-h-[620px]"
            >
              <AktualnosciPostCard post={featuredPosts[0]} featured from="blog" />
            </motion.div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
            {featuredPosts.slice(1).map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.08 * (index + 1),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="min-h-[260px] lg:min-h-[298px]"
              >
                <AktualnosciPostCard post={post} from="blog" />
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {standardPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {standardPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.05 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-h-[300px]"
            >
              <AktualnosciPostCard post={post} from="blog" />
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
