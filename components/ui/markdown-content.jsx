'use client';

const MarkdownContent = ({ content, className = '' }) => {
    if (!content) return null;

    return (
        <div className={`mx-auto ${className}`}>
            <div
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: content }}
                className='rich-text-content prose prose-invert prose-lg max-w-none'
            />

            <style jsx global>{`
                .rich-text-content {
                    font-family: inherit;
                    width: 100%;
                }
                .rich-text-content > * + * {
                    margin-top: 1.5em;
                }
                .rich-text-content p {
                    margin-bottom: 1.5em;
                    line-height: 1.8;
                    /*  color: #d1d5db; */ /* gray-300 */
                    font-size: 1rem;
                }
                .rich-text-content h1,
                .rich-text-content h2,
                .rich-text-content h3,
                .rich-text-content h4 {
                    /* color: white; */
                    font-weight: 800;
                    letter-spacing: -0.025em;
                    margin-top: 2.5em;
                    margin-bottom: 1em;
                    line-height: 1.25;
                }
                .rich-text-content h1 {
                    font-size: 2.25rem;
                }
                .rich-text-content h2 {
                    font-size: 1.875rem;
                }
                .rich-text-content h3 {
                    font-size: 1.5rem;
                }
                .rich-text-content strong {
                    /* color: white; */
                    font-weight: 700;
                }
                .rich-text-content a {
                    color: hsl(var(--primary));
                    text-decoration: none;
                    font-weight: 500;
                    font-family: inherit;
                }
                .rich-text-content a:hover {
                    text-decoration: underline;
                }
                .rich-text-content ul {
                    list-style-type: disc !important;
                    padding-left: 1.625em;
                    margin-bottom: 1.5em;
                }
                .rich-text-content ol {
                    list-style-type: decimal !important;
                    padding-left: 1.625em;
                    margin-bottom: 1.5em;
                }
                .rich-text-content li {
                    margin-bottom: 0.5em;
                    color: #d1d5db;
                }
                .rich-text-content li::marker {
                    color: hsl(var(--primary));
                }
                .rich-text-content img {
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    max-width: 100%;
                    height: auto;
                    margin: 2.5rem 0;
                    display: block;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .rich-text-content figcaption {
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                .rich-text-content blockquote {
                    border-left: 4px solid hsl(var(--primary));
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1rem 1.5rem;
                    border-radius: 0 0.75rem 0.75rem 0;
                    font-style: italic;
                    color: #e5e7eb;
                    margin: 2rem 0;
                }
                /* Table Styles */
                .rich-text-content table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 2rem 0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    overflow: hidden;
                }
                .rich-text-content th,
                .rich-text-content td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: left;
                }
                .rich-text-content th {
                    background: rgba(255, 255, 255, 0.05);
                    font-weight: 700;
                    color: white;
                }
                .rich-text-content tr:last-child td {
                    border-bottom: none;
                }
                .rich-text-content th:last-child,
                .rich-text-content td:last-child {
                    border-right: none;
                }
            `}</style>
        </div>
    );
};

export default MarkdownContent;

