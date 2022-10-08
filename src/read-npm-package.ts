import * as vscode from 'vscode';
import { getWorkspacePackageJsonPath } from './get-package-json-path';

interface IPackageFileWithDependencies {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

interface INpmPackage {
    name: string;
    version: string;
}

async function readPackageJson(): Promise<IPackageFileWithDependencies> {
    const workspacePackageJsonUri = getWorkspacePackageJsonPath();

    const packageJsonTextDocument = await vscode.workspace.openTextDocument(
        workspacePackageJsonUri
    );

    const packageJsonTextContents = packageJsonTextDocument.getText();

    return JSON.parse(packageJsonTextContents);
}

function convertDependenciesToNpmPackages(
    dependencies: Record<string, string> | undefined
): INpmPackage[] {
    if (!dependencies || !Object.keys(dependencies).length) {
        return [];
    }

    return Object.entries(dependencies).map(([name, version]) => {
        return {
            name,
            version,
        };
    });
}

export async function readNpmDependencies(): Promise<INpmPackage[]> {
    const packageJson = await readPackageJson();

    const allDependencies: INpmPackage[] = [
        ...convertDependenciesToNpmPackages(packageJson.dependencies),
        ...convertDependenciesToNpmPackages(packageJson.devDependencies),
    ].sort((a, b) => {
        const loweredA = a.name.toLocaleLowerCase();
        const loweredB = b.name.toLocaleLowerCase();

        if (loweredA > loweredB) {
            return 1;
        }

        if (loweredA < loweredB) {
            return -1;
        }

        return 0;
    });

    return allDependencies;
}

export interface INpmPackageQuickPickItem extends vscode.QuickPickItem {
    npmPackage: INpmPackage;
}

export function createNpmPackageQuickPickItems(
    npmPackages: INpmPackage[]
): INpmPackageQuickPickItem[] {
    return npmPackages.map((npmPackage) => {
        const quickPickItem: INpmPackageQuickPickItem = {
            label: `${npmPackage.name}: ${npmPackage.version}`,
            npmPackage,
            //buttons: []
        };

        return quickPickItem;
    });
}
