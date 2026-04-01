'use client';
import {
    createComment,
    likeComment,
    unlikeComment,
} from '@/app/_actions/blogs';
import {
    Check,
    ChevronDown,
    ChevronUp,
    Facebook,
    Link2,
    Linkedin,
    LogIn,
    MessageCircle,
    Reply,
    Send,
    Twitter,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from 'react-share';

const CommentsSection = ({ comments = [], blogId, postTitle }) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [expandedComments, setExpandedComments] = useState({});
    const [isPosting, setIsPosting] = useState(false);
    const [commentLikes, setCommentLikes] = useState({});
    const [likingComments, setLikingComments] = useState({});
    const [showAllComments, setShowAllComments] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [shareTitle, setShareTitle] = useState('');
    const { data: session } = useSession();
    const params = useParams();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }

        if (postTitle) {
            setShareTitle(postTitle);
        } else if (typeof document !== 'undefined') {
            setShareTitle(document.title);
        }
    }, [postTitle]);

    const isCommentLikedByUser = comment => {
        if (!session?.user?.id) return false;
        return (
            comment.likes?.some(like => like.likerId === session.user.id) ||
            false
        );
    };

    const handleCommentLike = async (commentId, isCurrentlyLiked) => {
        if (!session?.user) {
            alert('Please login to like comments');
            return;
        }

        if (likingComments[commentId]) return;

        setLikingComments(prev => ({ ...prev, [commentId]: true }));

        try {
            if (isCurrentlyLiked) {
                const unlike = await unlikeComment(commentId);

                setCommentLikes(prev => ({
                    ...prev,
                    [commentId]: {
                        isLiked: false,
                        count: Math.max(0, (prev[commentId]?.count || 0) - 1),
                    },
                }));
            } else {
                const like = await likeComment(commentId);
                setCommentLikes(prev => ({
                    ...prev,
                    [commentId]: {
                        isLiked: true,
                        count: (prev[commentId]?.count || 0) + 1,
                    },
                }));
            }
        } catch (error) {
            console.error('Failed to like/unlike comment:', error);
        } finally {
            setLikingComments(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const getCommentLikeData = comment => {
        const likeData = commentLikes[comment.id];
        const userHasLiked = isCommentLikedByUser(comment);

        return {
            isLiked:
                likeData?.isLiked !== undefined
                    ? likeData.isLiked
                    : userHasLiked,
            count:
                likeData?.count !== undefined
                    ? likeData.count
                    : comment._count.likes,
        };
    };

    const handlePostComment = async () => {
        if (!session?.user) {
            alert('Please login to comment');
            return;
        }

        if (!newComment.trim() || isPosting) return;

        setIsPosting(true);
        try {
            const comment = await createComment(blogId, {
                content: newComment,
                parentId: null,
                blogId: blogId,
                status: 'APPROVED',
            });

            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handlePostReply = async parentId => {
        if (!session?.user) {
            alert('Please login to reply');
            return;
        }

        if (!replyText.trim() || isPosting) return;

        setIsPosting(true);
        try {
            const reply = await createComment(blogId, {
                content: replyText,
                parentId: parentId,
                blogId: blogId,
                status: 'APPROVED',
            });
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const toggleReplies = commentId => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 30) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const topLevelComments = comments.filter(c => !c.parentId);
    const displayedComments = showAllComments
        ? topLevelComments
        : topLevelComments.slice(0, 4);
    const hasMoreComments = topLevelComments.length > 4;

    return (
        <div className='max-w-7xl mx-auto'>
            {/* Engagement Bar */}
            <div className='flex items-center gap-6 py-8 border-t border-b border-gray-200 dark:border-gray-700 my-12'>
                <button className='flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 transition-colors'>
                    <MessageCircle className='w-5 h-5' />
                    <span className='font-medium'>
                        {topLevelComments.length} comments
                    </span>
                </button>
                <div className='ml-auto flex items-center gap-3'>
                    <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                        Share:
                    </span>
                    <TwitterShareButton
                        url={shareUrl}
                        title={shareTitle}
                        className='p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'>
                        <Twitter className='w-5 h-5' />
                    </TwitterShareButton>
                    <FacebookShareButton
                        url={shareUrl}
                        quote={shareTitle}
                        className='p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'>
                        <Facebook className='w-5 h-5' />
                    </FacebookShareButton>
                    <LinkedinShareButton
                        url={shareUrl}
                        title={shareTitle}
                        className='p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'>
                        <Linkedin className='w-5 h-5' />
                    </LinkedinShareButton>
                    <button
                        onClick={handleCopyLink}
                        className='p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative'
                        title={copied ? 'Copied!' : 'Copy link'}>
                        {copied ? (
                            <Check className='w-5 h-5 text-green-600 dark:text-green-400' />
                        ) : (
                            <Link2 className='w-5 h-5' />
                        )}
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className='mt-12'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-8'>
                    Comments ({topLevelComments.length})
                </h3>

                {/* New Comment Form - Only show if logged in */}
                {session?.user ? (
                    <div className='mb-8'>
                        <div className='flex gap-4'>
                            <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden'>
                                {session.user.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        width={40}
                                        height={40}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <span>
                                        {session.user.name?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                            <div className='flex-1'>
                                <textarea
                                    value={newComment}
                                    onChange={e =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder='Write a comment...'
                                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                                    rows={3}
                                />
                                <div className='flex justify-end mt-2'>
                                    <button
                                        onClick={handlePostComment}
                                        disabled={
                                            !newComment.trim() || isPosting
                                        }
                                        className='flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                        <Send className='w-4 h-4' />
                                        {isPosting
                                            ? 'Posting...'
                                            : 'Post Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href={`/site/${params?.tenantId}/sign-in`}>
                        <div className='mb-8 p-6 cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center justify-center gap-3'>
                                <LogIn className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                                <p className='text-gray-700 dark:text-gray-300 font-medium'>
                                    Please login to write a comment
                                </p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Comments List */}
                <div className='space-y-6'>
                    {displayedComments.map(comment => {
                        return (
                            <div key={comment.id} className=''>
                                {/* Comment */}
                                <div className='flex gap-4'>
                                    {comment.author.image?.url ? (
                                        <Image
                                            width={40}
                                            height={40}
                                            src={comment.author.image?.url}
                                            alt={comment.author.name}
                                            className='w-8 h-8 rounded-full object-cover dark:ring-2 dark:ring-gray-600 flex-shrink-0'
                                        />
                                    ) : (
                                        <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden'>
                                            {comment.author.name?.charAt(0) ||
                                                'U'}
                                        </div>
                                    )}

                                    <div className='flex-1'>
                                        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <span className='font-semibold text-xs text-gray-900 dark:text-gray-100'>
                                                    {comment.author.name}
                                                </span>
                                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {formatDate(
                                                        comment.createdAt
                                                    )}
                                                </span>
                                            </div>
                                            <p className='text-gray-700 dark:text-gray-300 text-sm'>
                                                {comment.content}
                                            </p>
                                        </div>

                                        {/* Comment Actions */}
                                        <div className='flex items-center gap-4 mt-2 ml-4'>
                                            {session?.user ? (
                                                <button
                                                    onClick={() =>
                                                        handleCommentLike(
                                                            comment.id,
                                                            getCommentLikeData(
                                                                comment
                                                            ).isLiked
                                                        )
                                                    }
                                                    disabled={
                                                        likingComments[
                                                            comment.id
                                                        ]
                                                    }
                                                    className={`text-sm font-medium transition-colors ${
                                                        getCommentLikeData(
                                                            comment
                                                        ).isLiked
                                                            ? 'text-primary hover:text-primary'
                                                            : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}>
                                                    {getCommentLikeData(comment)
                                                        .isLiked
                                                        ? 'Liked'
                                                        : 'Like'}{' '}
                                                    (
                                                    {
                                                        getCommentLikeData(
                                                            comment
                                                        ).count
                                                    }
                                                    )
                                                </button>
                                            ) : (
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                    {
                                                        getCommentLikeData(
                                                            comment
                                                        ).count
                                                    }{' '}
                                                    {getCommentLikeData(comment)
                                                        .count === 1
                                                        ? 'Like'
                                                        : 'Likes'}
                                                </span>
                                            )}

                                            {session?.user && (
                                                <button
                                                    onClick={() =>
                                                        setReplyingTo(
                                                            replyingTo ===
                                                                comment.id
                                                                ? null
                                                                : comment.id
                                                        )
                                                    }
                                                    className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary font-medium transition-colors'>
                                                    <Reply className='w-4 h-4' />
                                                    Reply
                                                </button>
                                            )}

                                            {comment._count.replies > 0 && (
                                                <button
                                                    onClick={() =>
                                                        toggleReplies(
                                                            comment.id
                                                        )
                                                    }
                                                    className='flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors'>
                                                    {expandedComments[
                                                        comment.id
                                                    ] ? (
                                                        <>
                                                            <ChevronUp className='w-4 h-4' />
                                                            Hide Replies
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className='w-4 h-4' />
                                                            Show{' '}
                                                            {
                                                                comment._count
                                                                    .replies
                                                            }{' '}
                                                            {comment._count
                                                                .replies === 1
                                                                ? 'Reply'
                                                                : 'Replies'}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Reply Form - Only show if logged in */}
                                        {replyingTo === comment.id &&
                                            session?.user && (
                                                <div className='mt-4 ml-4'>
                                                    <div className='flex gap-3'>
                                                        <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden'>
                                                            {session.user
                                                                .image ? (
                                                                <Image
                                                                    src={
                                                                        session
                                                                            .user
                                                                            .image
                                                                    }
                                                                    alt={
                                                                        session
                                                                            .user
                                                                            .name ||
                                                                        'User'
                                                                    }
                                                                    width={32}
                                                                    height={32}
                                                                    className='w-full h-full object-cover'
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {session.user.name?.charAt(
                                                                        0
                                                                    ) || 'U'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className='flex-1'>
                                                            <textarea
                                                                value={
                                                                    replyText
                                                                }
                                                                onChange={e =>
                                                                    setReplyText(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder={`Reply to ${comment.author.name}...`}
                                                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm'
                                                                rows={2}
                                                            />
                                                            <div className='flex justify-end gap-2 mt-2'>
                                                                <button
                                                                    onClick={() => {
                                                                        setReplyingTo(
                                                                            null
                                                                        );
                                                                        setReplyText(
                                                                            ''
                                                                        );
                                                                    }}
                                                                    className='px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handlePostReply(
                                                                            comment.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !replyText.trim() ||
                                                                        isPosting
                                                                    }
                                                                    className='flex items-center gap-2 px-4 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                                                    <Send className='w-3 h-3' />
                                                                    {isPosting
                                                                        ? 'Posting...'
                                                                        : 'Reply'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        {/* Replies */}
                                        {expandedComments[comment.id] &&
                                            comment.replies &&
                                            comment.replies.length > 0 && (
                                                <div className='mt-4 ml-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700'>
                                                    {comment.replies.map(
                                                        reply => (
                                                            <div
                                                                key={reply.id}
                                                                className='flex gap-3'>
                                                                {reply.author
                                                                    .image ? (
                                                                    <Image
                                                                        width={
                                                                            32
                                                                        }
                                                                        height={
                                                                            32
                                                                        }
                                                                        src={
                                                                            reply
                                                                                .author
                                                                                .image ||
                                                                            reply
                                                                                .author
                                                                                .image
                                                                                ?.url ||
                                                                            '/placeholder-user.jpg'
                                                                        }
                                                                        alt={
                                                                            reply
                                                                                .author
                                                                                .name
                                                                        }
                                                                        className='w-8 h-8 rounded-full object-cover dark:ring-2 dark:ring-gray-600 flex-shrink-0'
                                                                    />
                                                                ) : (
                                                                    <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden'>
                                                                        {reply.author.name?.charAt(
                                                                            0
                                                                        ) ||
                                                                            'U'}
                                                                    </div>
                                                                )}

                                                                <div className='flex-1'>
                                                                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2'>
                                                                        <div className='flex items-center gap-2 mb-1'>
                                                                            <span className='font-semibold text-sm text-gray-900 dark:text-gray-100'>
                                                                                {
                                                                                    reply
                                                                                        .author
                                                                                        .name
                                                                                }
                                                                            </span>
                                                                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                                                {formatDate(
                                                                                    reply.createdAt
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                                                            {
                                                                                reply.content
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className='flex items-center gap-3 mt-1 ml-3'>
                                                                        {session?.user ? (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleCommentLike(
                                                                                        reply.id,
                                                                                        getCommentLikeData(
                                                                                            reply
                                                                                        )
                                                                                            .isLiked
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    likingComments[
                                                                                        reply
                                                                                            .id
                                                                                    ]
                                                                                }
                                                                                className={`text-xs font-medium transition-colors ${
                                                                                    getCommentLikeData(
                                                                                        reply
                                                                                    )
                                                                                        .isLiked
                                                                                        ? 'text-primary hover:text-primary'
                                                                                        : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                                                                } disabled:opacity-50 disabled:cursor-not-allowed`}>
                                                                                {getCommentLikeData(
                                                                                    reply
                                                                                )
                                                                                    .isLiked
                                                                                    ? 'Liked'
                                                                                    : 'Like'}{' '}
                                                                                (
                                                                                {
                                                                                    getCommentLikeData(
                                                                                        reply
                                                                                    )
                                                                                        .count
                                                                                }

                                                                                )
                                                                            </button>
                                                                        ) : (
                                                                            <span className='text-xs text-gray-600 dark:text-gray-400'>
                                                                                {
                                                                                    getCommentLikeData(
                                                                                        reply
                                                                                    )
                                                                                        .count
                                                                                }{' '}
                                                                                {getCommentLikeData(
                                                                                    reply
                                                                                )
                                                                                    .count ===
                                                                                1
                                                                                    ? 'Like'
                                                                                    : 'Likes'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show More/Less Button */}
                {hasMoreComments && (
                    <div className='flex justify-center mt-8'>
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className='flex items-center gap-2 px-3 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors'>
                            {showAllComments ? (
                                <>
                                    <ChevronUp className='w-5 h-5' />
                                    Show Less Comments
                                </>
                            ) : (
                                <>
                                    <ChevronDown className='w-5 h-5' />
                                    Show More Comments (
                                    {topLevelComments.length - 4} more)
                                </>
                            )}
                        </button>
                    </div>
                )}

                {topLevelComments.length === 0 && (
                    <div className='text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                        <MessageCircle className='w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3' />
                        <p className='text-gray-600 dark:text-gray-400'>
                            No comments yet. Be the first to comment!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;

