'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Copy01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { FaMailchimp } from 'react-icons/fa';
import { SiN8N } from 'react-icons/si';
import { TbBrandZapier } from 'react-icons/tb';

export default function Instruction({ instruction, type }) {
    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    let icon;
    switch (type) {
        case 'mailchimp':
            icon = <FaMailchimp className='h-6 w-6' />;
            break;
        case 'zapier':
            icon = <TbBrandZapier className='h-6 w-6' />;
            break;
        case 'n8n':
            icon = <SiN8N className='h-6 w-6' />;
            break;
        default:
            icon = <TbBrandZapier className='h-6 w-6' />;
            break;
    }

    return (
        <Card className='border-border'>
            <CardHeader>
                <div className='flex items-start gap-3'>
                    <div className='bg-muted p-2 rounded-lg'>{icon}</div>
                    <div className='flex-1'>
                        <CardTitle className='text-lg mb-1'>
                            {instruction.title}
                        </CardTitle>
                        <CardDescription>
                            {instruction.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-6'>
                {instruction.endpoint && (
                    <div>
                        <label className='text-sm font-medium text-muted-foreground mb-2 block'>
                            Endpoint
                        </label>
                        <div className='flex instructions-center gap-2'>
                            <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded'>
                                {instruction.method}
                            </span>
                            <code className='flex-1 px-3 py-2 bg-muted text-foreground rounded text-sm font-mono'>
                                {instruction.endpoint}
                            </code>
                            <button
                                onClick={() =>
                                    copyToClipboard(
                                        instruction.endpoint,
                                        instruction.id
                                    )
                                }
                                className='p-2 hover:bg-muted rounded transition-colors'
                                title='Copy endpoint'>
                                {copiedId === instruction.id ? (
                                    <HugeiconsIcon
                                        icon={Tick01Icon}
                                        className='w-4 h-4 text-green-600'
                                    />
                                ) : (
                                    <HugeiconsIcon
                                        icon={Copy01Icon}
                                        className='w-4 h-4 text-muted-foreground'
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className='text-md font-medium flex instructions-center justify-start gap-2 text-muted-foreground mb-3'>
                        Setup Instructions
                    </h3>
                    <ol className='space-y-2'>
                        {instruction.instructions?.map((instruction, index) => (
                            <li
                                key={index}
                                className='flex gap-3 text-sm text-muted-foreground'>
                                <span className='flex-shrink-0 w-5 h-5 flex instructions-center justify-center bg-muted rounded-full text-xs font-medium text-foreground'>
                                    {index + 1}
                                </span>
                                <span className='pt-0.5'>{instruction}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {instruction.payload && (
                    <div>
                        <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                            Example Payload
                        </h3>
                        <pre className='bg-secondary text-secondary-foreground p-4 rounded text-xs overflow-x-auto'>
                            <code>
                                {JSON.stringify(instruction.payload, null, 2)}
                            </code>
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
