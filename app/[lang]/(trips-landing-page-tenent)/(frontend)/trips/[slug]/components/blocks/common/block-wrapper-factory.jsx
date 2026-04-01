import React from 'react';

/**
 * Higher-Order Component to create a block wrapper that handles variants.
 * @param {Object} variants - Map of variant IDs to Components.
 * @param {string} defaultVariant - The default variant ID.
 * @returns {React.Component} - The wrapper component.
 */
export const createBlockWrapper = (variants, defaultVariant = 'default') => {
    return props => {
        const { data, trip, isBlock } = props;

        let sourceData = null;
        if (isBlock && data) {
            sourceData = data;
        } else {
            // This fallback logic (trip.userAddedOptions...) depends on determining the key
            // from the block type, but typically the Wrapper is registered as the block component itself,
            // so it receives the data it needs.
            // However, existing TeamBlockWrapper handled trip.userAddedOptions.teamSection.
            // We might need to standardize how legacy data is retrieved if we want this truly generic.
            // For now, we'll assume 'data' prop is the primary source for blocks (v2),
            // and if standard components need legacy support, they handle it internally or via a specific prop.

            // Actually, the TeamBlockWrapper had specific logic:
            // sourceData = trip?.userAddedOptions?.teamSection;

            // If we want this generic, we might rely on the keys being consistent or passed in.
            // But let's look at the usage: SortableBlock passes `data={block.data}`.
            // So for block-based editor, `data` is available.
            sourceData = data;
        }

        const variant = sourceData?.variant || defaultVariant;
        const Component =
            variants[variant] ||
            variants[defaultVariant] ||
            Object.values(variants)[0];

        if (!Component) {
            return <div>Variant not found: {variant}</div>;
        }

        return <Component {...props} />;
    };
};

