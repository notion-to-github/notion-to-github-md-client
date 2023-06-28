import Recoil from '@/lib/registry/recoil';
import StyledComponentsRegistry from '@/lib/registry/styledComponents';

export const metadata = {
    title: 'Notion to GitHub MD',
    description:
        'A service that extracts markdowns from Notion and uploads them to GitHub',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="kr">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <Recoil>
                    <StyledComponentsRegistry>
                        {children}
                    </StyledComponentsRegistry>
                </Recoil>
            </body>
        </html>
    );
}
