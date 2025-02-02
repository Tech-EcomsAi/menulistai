import * as XLSX from 'xlsx';

const getOutputJson = (projectData) => {
    // Combine all categories and items from each file

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
}

export const handleJsonDownload = (projectData) => {
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(getOutputJson(projectData), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const handleXlsDownload = (projectData) => {
    const data = getOutputJson(projectData);
    const wb = XLSX.utils.book_new();

    // Extract language codes from the format "English (en)" to "en"
    const languageCodes = data.languages.map(lang => {
        const match = lang.match(/\((.*?)\)/);
        return match ? match[1] : lang;
    });

    // 1. Languages Sheet
    const languagesData = data.languages.map(lang => {
        const code = lang.match(/\((.*?)\)/)?.[1] || lang;
        const name = lang.split(' (')[0] || lang;
        return {
            language_code: code,
            language_name: name
        };
    });
    const languagesSheet = XLSX.utils.json_to_sheet(languagesData);
    XLSX.utils.book_append_sheet(wb, languagesSheet, 'Languages');

    // 2. Categories Sheet
    const categoriesData = [];
    data.categories.forEach(category => {
        languageCodes.forEach(langCode => {
            categoriesData.push({
                id: category.id,
                language_code: langCode,
                name: category.name?.[langCode] || ''
            });
        });
    });
    const categoriesSheet = XLSX.utils.json_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, categoriesSheet, 'Categories');

    // 3. Items Sheet
    const itemsData = [];
    data.items.forEach(item => {
        languageCodes.forEach(langCode => {
            const itemRow = {
                id: item.id,
                category: item.category,
                language_code: langCode,
                name: item.name?.[langCode] || '',
                price: item.price || ''
            };
            itemsData.push(itemRow);
        });
    });
    const itemsSheet = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, itemsSheet, 'Items');

    // 4. Combined Sheet
    const combinedData = [];
    data.items.forEach(item => {
        const category = data.categories.find(cat => cat.id === item.category);

        languageCodes.forEach(langCode => {
            // Handle items with attributes
            if (item.attributes && item.attributes.length > 0) {
                item.attributes.forEach(attr => {
                    combinedData.push({
                        item_id: item.id,
                        category_id: item.category,
                        category_name: category?.name?.[langCode] || '',
                        language_code: langCode,
                        item_name: item.name?.[langCode] || '',
                        attribute_id: attr.id,
                        attribute_name: attr.name?.[langCode] || '',
                        price: attr.price || ''
                    });
                });
            } else {
                // Handle items without attributes
                combinedData.push({
                    item_id: item.id,
                    category_id: item.category,
                    category_name: category?.name?.[langCode] || '',
                    language_code: langCode,
                    item_name: item.name?.[langCode] || '',
                    attribute_id: '',
                    attribute_name: '',
                    price: item.price || ''
                });
            }
        });
    });

    const combinedSheet = XLSX.utils.json_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(wb, combinedSheet, 'Combined');

    // Download the file
    XLSX.writeFile(wb, 'menu_data.xlsx');
}