import 'server-only';

const dictionaries = {
    en: () => import('./en.json').then(module => module.default),
    nl: () => import('./nl.json').then(module => module.default),
};

export const getDictionary = async locale => {
    const dict = dictionaries[locale] || dictionaries['en'];
    return dict();
};

