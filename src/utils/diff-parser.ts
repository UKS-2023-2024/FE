interface ContentChange {
    type: string;
    content: string;
}

interface FileChange {
    fileName: string;
    contentChanges: ContentChange[];
}

interface Patch {
    from: string;
    fromEmail: string;
    fromDate: string;
    subject?: string;
    fileChanges?: FileChange[];
}

export const parseUnifiedDiff = (diffText: string): Patch[] => {
    if (!diffText || diffText.trim() === "") return []
    const patches: Patch[] = [];
    let currentPatch: Patch | null = null;
    let currentFileChange: FileChange | null = null;

    const lines: string[] = diffText.split('\n');

    lines.forEach(line => {
        if (line.startsWith('From: ')) {
            console.log(line)
            // New patch
            currentPatch = {
                from: line.split(' ')[1],
                fromEmail: line.split('<')[1].split('>')[0],
                fromDate: line.split('Date: ')[1]
            };
            patches.push(currentPatch);
        } else if (line.startsWith('Subject:')) {
            // Subject of the patch
            if (currentPatch) {
                currentPatch.subject = line.replace('Subject: ', '');
            }
        } else if (line.startsWith('--- ') || line.startsWith('+++ ')) {
            // File change
            const fileName: string = line.split(' ')[1];
            currentFileChange = { fileName, contentChanges: [] };
            if (currentPatch) {
                currentPatch.fileChanges = currentPatch.fileChanges || [];
                currentPatch.fileChanges.push(currentFileChange);
            }
        } else if (line.startsWith('@@ ')) {
            // Hunk
            // Not handling hunks in this simple example
        } else if (line.startsWith('+') || line.startsWith('-') || line.startsWith(' ')) {
            // Line change
            if (currentFileChange) {
                const type: string = line[0];
                const content: string = line.substring(1);
                currentFileChange.contentChanges.push({ type, content });
            }
        }
    });

    return patches;
}