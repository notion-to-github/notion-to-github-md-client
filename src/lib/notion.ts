import { Client } from '@notionhq/client';

const generateNotionDatabase = async (notionAPIKey: string, pageId: string) => {
    const notion = new Client({
        auth: notionAPIKey,
    });

    const response = await notion.databases.create({
        parent: { type: 'page_id', page_id: pageId },
        title: [{ text: { content: 'Notion to GitHub' } }],
        properties: {
            title: { title: {} },
            summary: { rich_text: {} },
            status: { status: {} },
        },
    });
    console.log(response);

    return response;
};

export default generateNotionDatabase;
