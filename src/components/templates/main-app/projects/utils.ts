import * as XLSX from 'xlsx';
import { Project } from './type';

interface LanguageInfo {
    code: string;
    name: string;
}

const extractLanguageInfo = (languages: string[]): LanguageInfo[] => {
    return languages.map(lang => {
        const code = lang.match(/\((.*?)\)/)?.[1] || lang;
        const name = lang.split(' (')[0] || lang;
        return { code, name };
    });
};

const createLanguagesSheet = (languages: string[]): XLSX.WorkSheet => {
    if (languages.length <= 1) return null;

    const languagesData = extractLanguageInfo(languages).map(({ code, name }) => ({
        language_code: code,
        language_name: name
    }));
    return XLSX.utils.json_to_sheet(languagesData);
};

const createCategoriesSheet = (categories: any[], languageCodes: string[]): XLSX.WorkSheet => {
    const categoriesData = [];
    categories.forEach(category => {
        if (languageCodes.length <= 1) {
            // Single language: use default or first available language
            const langCode = languageCodes[0] || Object.keys(category.name)[0];
            categoriesData.push({
                id: category.id,
                name: category.name?.[langCode] || ''
            });
        } else {
            // Multiple languages: create row for each language
            languageCodes.forEach(langCode => {
                categoriesData.push({
                    id: category.id,
                    language_code: langCode,
                    name: category.name?.[langCode] || ''
                });
            });
        }
    });
    return XLSX.utils.json_to_sheet(categoriesData);
};

const createItemsSheet = (items: any[], languageCodes: string[]): XLSX.WorkSheet => {
    const itemsData = [];
    items.forEach(item => {
        if (languageCodes.length <= 1) {
            // Single language: use default or first available language
            const langCode = languageCodes[0] || Object.keys(item.name)[0];
            itemsData.push({
                id: item.id,
                category: item.category,
                name: item.name?.[langCode] || '',
                price: item.price || ''
            });
        } else {
            // Multiple languages: create row for each language
            languageCodes.forEach(langCode => {
                itemsData.push({
                    id: item.id,
                    category: item.category,
                    language_code: langCode,
                    name: item.name?.[langCode] || '',
                    price: item.price || ''
                });
            });
        }
    });
    return XLSX.utils.json_to_sheet(itemsData);
};

const createCombinedSheet = (items: any[], categories: any[], languageCodes: string[]): XLSX.WorkSheet => {
    const combinedData = [];
    items.forEach(item => {
        const category = categories.find(cat => cat.id === item.category);
        const langCode = languageCodes.length <= 1 ?
            (languageCodes[0] || Object.keys(item.name)[0]) : null;

        const processLanguage = (currentLangCode: string) => {
            if (item.attributes && item.attributes.length > 0) {
                item.attributes.forEach(attr => {
                    const row: any = {
                        item_id: item.id,
                        category_id: item.category,
                        category_name: category?.name?.[currentLangCode] || '',
                        item_name: item.name?.[currentLangCode] || '',
                        attribute_id: attr.id,
                        attribute_name: attr.name?.[currentLangCode] || '',
                        price: attr.price || ''
                    };
                    if (languageCodes.length > 1) {
                        row.language_code = currentLangCode;
                    }
                    combinedData.push(row);
                });
            } else {
                const row: any = {
                    item_id: item.id,
                    category_id: item.category,
                    category_name: category?.name?.[currentLangCode] || '',
                    item_name: item.name?.[currentLangCode] || '',
                    attribute_id: '',
                    attribute_name: '',
                    price: item.price || ''
                };
                if (languageCodes.length > 1) {
                    row.language_code = currentLangCode;
                }
                combinedData.push(row);
            }
        };

        if (langCode) {
            processLanguage(langCode);
        } else {
            languageCodes.forEach(processLanguage);
        }
    });
    return XLSX.utils.json_to_sheet(combinedData);
};

const transformForSingleLanguage = (data: any, langCode: string) => {
    return {
        ...data,
        categories: data.categories.map(category => ({
            ...category,
            name: category.name?.[langCode] || ''
        })),
        items: data.items.map(item => {
            const transformed = {
                ...item,
                name: item.name?.[langCode] || ''
            };

            if (item.attributes) {
                transformed.attributes = item.attributes.map(attr => ({
                    ...attr,
                    name: attr.name?.[langCode] || ''
                }));
            }

            return transformed;
        })
    };
};

const getOutputJson = (projectData: Project) => {
    const combinedData = {
        categories: [],
        items: [],
        languages: projectData.languages || []
    };

    projectData.files?.forEach(file => {
        if (file.modelResponse?.data) {
            const data = file.modelResponse.data;
            if (data.categories) {
                combinedData.categories = [
                    ...combinedData.categories,
                    ...data.categories
                ];
            }
            if (data.items) {
                combinedData.items = [
                    ...combinedData.items,
                    ...data.items
                ];
            }
        }
    });

    // Remove duplicates based on id
    combinedData.categories = Array.from(new Map(
        combinedData.categories.map(item => [item.id, item])
    ).values());
    combinedData.items = Array.from(new Map(
        combinedData.items.map(item => [item.id, item])
    ).values());

    return combinedData;
};

export const handleDownload = (projectData: Project, type: 'json' | 'xlsx') => {
    const data = getOutputJson(projectData);

    if (type === 'json') {
        // Transform data if single language
        const languageCodes = data.languages.map(lang => {
            const match = lang.match(/\((.*?)\)/);
            return match ? match[1] : lang;
        });

        let outputData = data;
        if (languageCodes.length <= 1) {
            const langCode = languageCodes[0] || Object.keys(data.categories[0]?.name || {})[0];
            outputData = transformForSingleLanguage(data, langCode);
        }

        // Create and download JSON file
        const blob = new Blob([JSON.stringify(outputData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'menu_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    // Excel download
    const wb = XLSX.utils.book_new();

    // Extract language codes
    const languageCodes = data.languages.map(lang => {
        const match = lang.match(/\((.*?)\)/);
        return match ? match[1] : lang;
    });

    // Create sheets
    const languagesSheet = createLanguagesSheet(data.languages);
    const categoriesSheet = createCategoriesSheet(data.categories, languageCodes);
    const itemsSheet = createItemsSheet(data.items, languageCodes);
    const combinedSheet = createCombinedSheet(data.items, data.categories, languageCodes);

    // Add sheets to workbook
    if (languagesSheet) {
        XLSX.utils.book_append_sheet(wb, languagesSheet, 'Languages');
    }
    XLSX.utils.book_append_sheet(wb, categoriesSheet, 'Categories');
    XLSX.utils.book_append_sheet(wb, itemsSheet, 'Items');
    XLSX.utils.book_append_sheet(wb, combinedSheet, 'Combined');

    // Download the file
    XLSX.writeFile(wb, 'menu_data.xlsx');
}