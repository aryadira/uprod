'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const PageBreadcrumb: React.FC = () => {
  const pathname = usePathname(); // example: "/admin/majors/edit"

  const pathSegments = pathname
    .split('/')
    .filter(Boolean); // ['admin', 'majors', 'edit']

  const generatePath = (index: number) =>
    '/' + pathSegments.slice(0, index + 1).join('/');

  const formatSegment = (segment: string) =>
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

  return (
    <div className="flex flex-col gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = generatePath(index);

            return (
              <li key={index} className="text-sm">
                {!isLast ? (
                  <Link
                    href={href}
                    className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5"
                  >
                    {formatSegment(segment)}
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-gray-800 dark:text-white/90">
                    {formatSegment(segment)}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
       <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {formatSegment(pathSegments[pathSegments.length - 1] || 'Home')}
      </h2>
    </div>
  );
};

export default PageBreadcrumb;
