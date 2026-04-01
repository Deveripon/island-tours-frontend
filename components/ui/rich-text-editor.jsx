'use client';

import { CharacterCount } from '@tiptap/extension-character-count';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import { uploadSingleImage } from '@/app/_actions/trips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    Redo,
    Sparkles,
    Table as TableIcon,
    Type,
    Underline as UnderlineIcon,
    Undo,
    Unlink,
} from 'lucide-react';
import { toast } from 'sonner';

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            caption: { default: null },
        };
    },
});

const CustomTextStyle = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: element => element.style.fontSize,
                renderHTML: attributes => {
                    if (!attributes.fontSize) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes.fontSize}`,
                    };
                },
            },
        };
    },
});

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
    <Button
        variant={isActive ? 'default' : 'ghost'}
        size='sm'
        className={`h-8 w-8 p-0 ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
        type='button'>
        {children}
    </Button>
);

// --- TipTap Surface Component ---
function TipTapSurface({ value, onChange, placeholder }) {
    const [mounted, setMounted] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [fontSize, setFontSize] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            // StarterKit provides the core (Bold, Italic, etc.)
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            // Manual extensions that don't exist in StarterKit
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 cursor-pointer',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            CustomImage.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl border border-white/10 max-w-full h-auto shadow-2xl block my-8',
                },
                allowBase64: true,
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
            CustomTextStyle,
            FontFamily,
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({
                HTMLAttributes: {
                    class: 'bg-primary/20 text-primary-foreground px-1 rounded-sm',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-border bg-muted p-2 text-left font-bold',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2 bg-background/50',
                },
            }),
            CharacterCount,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: `prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] p-6 prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6 prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5 prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4 prose-ul:marker:text-primary prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4 prose-ol:marker:text-primary prose-li:text-muted-foreground prose-li:my-1 prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden prose-th:bg-muted/50 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:p-3 prose-td:border-t prose-td:border-border`,
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    const setLink = useCallback(() => {
        if (!linkUrl) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: linkUrl })
            .run();
        setLinkUrl('');
    }, [editor, linkUrl]);

    const addImage = useCallback(() => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setImageCaption('');
            setIsImagePopoverOpen(false);
        }
    }, [editor, imageUrl, imageCaption]);

    const handleFileUpload = async e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const result = await uploadSingleImage(file, {
                folder: 'users/media',
                skipRevalidation: true,
            });
            if (result.success && result.data?.url) {
                setImageUrl(result.data.url);
                toast.success('Image uploaded. Click Insert to add.');
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (!mounted || !editor) {
        return (
            <div className='h-[400px] w-full bg-muted/5 border border-border rounded-xl animate-pulse' />
        );
    }

    return (
        <div className='flex flex-col border border-border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm'>
            <div className='flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/20 rounded-t-xl'>
                <div className='flex items-center gap-1 mr-2 pr-2 border-r border-border/50'>
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title='Undo'>
                        <Undo className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title='Redo'>
                        <Redo className='w-4 h-4' />
                    </MenuButton>
                </div>

                <div className='flex items-center gap-1 mr-2 pr-2 border-r border-border/50'>
                    <MenuButton
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                        isActive={editor.isActive('heading', { level: 1 })}
                        title='H1'>
                        <Heading1 className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        isActive={editor.isActive('heading', { level: 2 })}
                        title='H2'>
                        <Heading2 className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().setParagraph().run()
                        }
                        isActive={editor.isActive('paragraph')}
                        title='P'>
                        <Type className='w-4 h-4' />
                    </MenuButton>

                    {/* Font Selection */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 px-2! text-xs text-muted-foreground hover:bg-muted hover:text-foreground font-medium'>
                                Font
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className='w-40 p-1 z-[99999]'
                            align='start'>
                            <div className='flex flex-col'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('Inter')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'Inter' }}>
                                    Inter
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily(
                                                'Comic Sans MS, Comic Sans'
                                            )
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) ? 'bg-muted' : ''}`}
                                    style={{
                                        fontFamily: 'Comic Sans MS, Comic Sans',
                                    }}>
                                    Comic Sans
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('serif')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'serif' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'serif' }}>
                                    Serif
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('monospace')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'monospace' }}>
                                    Monospace
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('cursive')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'cursive' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'cursive' }}>
                                    Cursive
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('fantasy')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'fantasy' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'fantasy' }}>
                                    Fantasy
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('Arial, sans-serif')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Arial, sans-serif' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'Arial, sans-serif' }}>
                                    Arial
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('Georgia, serif')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Georgia, serif' }) ? 'bg-muted' : ''}`}
                                    style={{ fontFamily: 'Georgia, serif' }}>
                                    Georgia
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily('Impact, sans-serif')
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Impact, sans-serif' }) ? 'bg-muted' : ''}`}
                                    style={{
                                        fontFamily: 'Impact, sans-serif',
                                    }}>
                                    Impact
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily(
                                                'Times New Roman, serif'
                                            )
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Times New Roman, serif' }) ? 'bg-muted' : ''}`}
                                    style={{
                                        fontFamily: 'Times New Roman, serif',
                                    }}>
                                    Times New Roman
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setFontFamily(
                                                'Verdana, sans-serif'
                                            )
                                            .run()
                                    }
                                    className={`justify-start ${editor.isActive('textStyle', { fontFamily: 'Verdana, sans-serif' }) ? 'bg-muted' : ''}`}
                                    style={{
                                        fontFamily: 'Verdana, sans-serif',
                                    }}>
                                    Verdana
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .unsetFontFamily()
                                            .run()
                                    }
                                    className='justify-start text-muted-foreground'>
                                    Default
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Font Size Selection */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 px-2  text-xs text-muted-foreground hover:bg-muted hover:text-foreground font-medium'>
                                Font Size
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className='w-48 p-3 z-[99999]'
                            align='start'>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-xs text-muted-foreground'>
                                    Font Size
                                </Label>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setMark('textStyle', {
                                                fontSize: '12px',
                                            })
                                            .run()
                                    }
                                    className='justify-start text-xs'>
                                    Small (12px)
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setMark('textStyle', {
                                                fontSize: '16px',
                                            })
                                            .run()
                                    }
                                    className='justify-start text-base'>
                                    Normal (16px)
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setMark('textStyle', {
                                                fontSize: '20px',
                                            })
                                            .run()
                                    }
                                    className='justify-start text-lg font-medium'>
                                    Large (20px)
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setMark('textStyle', {
                                                fontSize: '24px',
                                            })
                                            .run()
                                    }
                                    className='justify-start text-xl font-bold'>
                                    Huge (24px)
                                </Button>

                                <div className='flex items-center gap-2 my-1'>
                                    <div className='h-px bg-border flex-1' />
                                    <span className='text-[10px] text-muted-foreground'>
                                        Custom
                                    </span>
                                    <div className='h-px bg-border flex-1' />
                                </div>

                                <div className='flex gap-2'>
                                    <Input
                                        placeholder='e.g. 32px, 2rem'
                                        value={fontSize}
                                        onChange={e =>
                                            setFontSize(e.target.value)
                                        }
                                        className='h-8 text-xs'
                                    />
                                    <Button
                                        onClick={() => {
                                            if (fontSize) {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .setMark('textStyle', {
                                                        fontSize,
                                                    })
                                                    .run();
                                                setFontSize('');
                                            }
                                        }}
                                        size='sm'
                                        className='h-8 px-2'>
                                        Set
                                    </Button>
                                </div>

                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .unsetMark('textStyle')
                                            .run()
                                    }
                                    className='h-8 text-xs text-muted-foreground justify-start px-2 w-full mt-1'>
                                    Reset to default
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Text Alignment */}
                <div className='flex items-center gap-1 mr-2 pr-2 border-r border-border/50'>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('left').run()
                        }
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title='Align Left'>
                        <AlignLeft className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('center').run()
                        }
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title='Align Center'>
                        <AlignCenter className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('right').run()
                        }
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title='Align Right'>
                        <AlignRight className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('justify').run()
                        }
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title='Justify'>
                        <AlignJustify className='w-4 h-4' />
                    </MenuButton>
                </div>

                <div className='flex items-center gap-1 mr-2 pr-2 border-r border-border/50'>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive('bold')}
                        title='Bold'>
                        <Bold className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive('italic')}
                        title='Italic'>
                        <Italic className='w-4 h-4' />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        isActive={editor.isActive('underline')}
                        title='Underline'>
                        <UnderlineIcon className='w-4 h-4' />
                    </MenuButton>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={
                                    editor.isActive('link')
                                        ? 'default'
                                        : 'ghost'
                                }
                                size='sm'
                                className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                                <LinkIcon className='w-4 h-4' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className='w-72 bg-popover border-border p-3 z-[99999]'
                            side='bottom'
                            align='center'
                            sideOffset={5}>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-xs text-muted-foreground'>
                                    Link URL
                                </Label>
                                <div className='flex gap-2'>
                                    <Input
                                        placeholder='https://...'
                                        value={linkUrl}
                                        onChange={e =>
                                            setLinkUrl(e.target.value)
                                        }
                                        className='h-8 bg-background border-border text-xs'
                                    />
                                    <Button
                                        onClick={setLink}
                                        size='sm'
                                        className='h-8 bg-primary text-primary-foreground'>
                                        Apply
                                    </Button>
                                    {editor.isActive('link') && (
                                        <Button
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .unsetLink()
                                                    .run();
                                                setLinkUrl('');
                                            }}
                                            size='sm'
                                            variant='outline'
                                            className='h-8 border-destructive/50 text-destructive hover:bg-destructive/10'>
                                            <Unlink className='w-4 h-4' />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive('bulletList')}
                    title='Bullet List'>
                    <List className='w-4 h-4' />
                </MenuButton>

                <Popover
                    open={isImagePopoverOpen}
                    onOpenChange={setIsImagePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground'>
                            <ImageIcon className='w-4 h-4' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className='w-80 bg-popover border-border p-4 z-[99999]'
                        side='bottom'
                        align='center'
                        sideOffset={5}>
                        <div className='flex flex-col gap-3'>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleFileUpload}
                                className='text-[10px] text-muted-foreground'
                            />
                            <Input
                                placeholder='Image URL...'
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                className='h-8 bg-background border-border text-xs'
                            />
                            <Button
                                onClick={addImage}
                                size='sm'
                                className='bg-primary text-primary-foreground'
                                disabled={!imageUrl || isUploading}>
                                Insert
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <MenuButton
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .insertTable({
                                rows: 3,
                                cols: 3,
                                withHeaderRow: true,
                            })
                            .run()
                    }
                    title='Table'>
                    <TableIcon className='w-4 h-4' />
                </MenuButton>
            </div>

            <div className='flex-1 relative bg-background/20 min-h-[400px]'>
                <EditorContent editor={editor} />
            </div>

            <div className='flex items-center justify-between px-4 py-2 bg-muted/20 border-t border-border text-[10px] text-muted-foreground uppercase font-medium rounded-b-xl'>
                <span>Words: {editor.storage.characterCount.words()}</span>
                <span className='flex items-center gap-1 text-primary'>
                    <Sparkles className='w-2.5 h-2.5' /> Editor Active
                </span>
            </div>
        </div>
    );
}

// --- Main Component ---
export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
}) {
    const { theme } = useTheme();

    return (
        <div
            suppressHydrationWarning
            className='w-full space-y-3'
            data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
            <TipTapSurface
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror:focus {
                    outline: none;
                }
                /* Ensure lists are visible */
                .prose ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                }
                .prose ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                }
                /* Fix Table Borders */
                .ProseMirror table {
                    border-collapse: collapse;
                    margin: 0;
                    overflow: hidden;
                    table-layout: fixed;
                    width: 100%;
                }
                .ProseMirror td,
                .ProseMirror th {
                    border: 1px solid var(--border);
                    box-sizing: border-box;
                    min-width: 1em;
                    padding: 6px 8px;
                    position: relative;
                    vertical-align: top;
                }
                .ProseMirror th {
                    background-color: var(--muted);
                    font-weight: bold;
                    text-align: left;
                }
            `}</style>
        </div>
    );
}

