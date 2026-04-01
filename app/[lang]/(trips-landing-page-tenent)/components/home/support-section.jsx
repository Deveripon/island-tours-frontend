'use client';
import {
    ArrowDown01Icon,
    Mail02Icon,
    WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import SectionTitle from './section-title';
export default function SupportSection({
    tenantId,
    faqs,
    enableWhatsAppChat,
    whatsappNumber }) {
    const [openItem, setOpenItem] = useState(null);

    const toggleItem = index => {
        setOpenItem(openItem === index ? null : index);
    };

    return (
        <div className='bg-muted/30 py-16 md:py-22 px-4'>
            <div className='container mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
                    {/* Left Side - Support Info */}

                    <div className=''>
                        <SectionTitle
                            title='Experience our excellent'
                            highlightedText='Support'
                        />
                        <section className='relative bg-card rounded-2xl py-5  px-5 text-center overflow-hidden border border-border shadow-lg'>
                            {/* Dark overlay */}
                            {/* <div className='absolute inset-0 bg-gray-200 bg-opacity-30 z-10'></div> */}

                            <div className='relative z-20 max-w-6xl flex flex-col justify-center items-center mx-auto'>
                                {/* Main Title */}
                                <h2 className='text-lg font-normal font-dm-sans text-foreground mb-5 tracking-tight'>
                                    Still have questions?
                                </h2>

                                {/* Subtitle */}
                                <p className='text-sm text-muted-foreground mb-5 leading-relaxed font-light'>
                                    Can&apos;t find the answer you&apos;re
                                    looking for? Please chat to our friendly
                                    team.
                                </p>

                                {enableWhatsAppChat ? (
                                    <Link
                                        target='_blank'
                                        href={`https://wa.me/${whatsappNumber}`}
                                        className='px-6 py-2 xs:px-6 xs:py-3 w-fit flex items-center justify-center gap-2 rounded-full text-primary-foreground leading-relaxed text-sm sm:text-base border-2 border-border bg-primary hover:bg-primary/90 transition-all duration-300 tracking-tighter shadow-lg'>
                                        Chat with Us
                                        <HugeiconsIcon icon={WhatsappIcon} />
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/site/${tenantId}/contact`}
                                        className='px-6 py-2 xs:px-6 xs:py-3 w-fit flex items-center justify-center gap-2 rounded-full text-primary-foreground leading-relaxed text-sm sm:text-base border-2 border-border bg-primary hover:bg-primary/90 transition-all duration-300 tracking-tighter shadow-lg'>
                                        <HugeiconsIcon icon={Mail02Icon} />
                                        Contact Us
                                    </Link>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Side - FAQ Accordion */}
                    <div>
                        <div className='space-y-5'>
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    className='border border-border shadow-lg rounded-lg px-6 bg-card'
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}>
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className='w-full text-left  py-4 flex justify-between items-center group transition-colors duration-200'>
                                        <span
                                            className={`font-medium ${
                                                openItem === index
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            }  pr-4`}>
                                            {faq.question}
                                        </span>
                                        <motion.div
                                            animate={{
                                                rotate:
                                                    openItem === index
                                                        ? 180
                                                        : 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: 'easeInOut',
                                            }}
                                            className='flex-shrink-0'>
                                            <HugeiconsIcon
                                                icon={ArrowDown01Icon}
                                                className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors'
                                            />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {openItem === index && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                    marginBottom: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                    marginBottom: 24,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                    marginBottom: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeInOut',
                                                    opacity: { duration: 0.2 },
                                                }}
                                                className='overflow-hidden'>
                                                <div className='text-muted-foreground leading-relaxed'>
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

