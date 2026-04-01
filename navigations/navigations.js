import enNavigations from './en-navigation';
import NlNavigations from './nl-navigations';

export const getNavigations = lang => {
    switch (lang) {
        case 'en':
            return enNavigations;  
        case 'nl':
            return NlNavigations;
        default:
            return enNavigations;
    }
};

     