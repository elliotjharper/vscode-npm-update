import * as vscode from 'vscode';

export function getWorkspacePackageJsonPath(): vscode.Uri {
    const workspaceRootUri = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!workspaceRootUri) {
        throw new Error('folder needed!');
    }

    const workspacePackageJsonUri = vscode.Uri.joinPath(workspaceRootUri, './package.json');

    return workspacePackageJsonUri;
}
