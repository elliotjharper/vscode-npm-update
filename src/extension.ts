import * as vscode from 'vscode';
import { createNpmPackageQuickPickItems, readNpmDependencies } from './read-npm-package';
import { updateNpmVersion } from './update-npm-version';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'elltg-npm-package-update.updateNpmPackage',
        async () => {
            const npmPackages = await readNpmDependencies();

            const selectedItem = await vscode.window.showQuickPick(
                createNpmPackageQuickPickItems(npmPackages)
            );
            if (!selectedItem) {
                return;
            }

            const selectedNpmPackage = selectedItem.npmPackage;

            const desiredVersion = await vscode.window.showInputBox({
                prompt: `Version pattern to use for ${selectedNpmPackage.name}`,
                value: selectedNpmPackage.version,
            });
            if (!desiredVersion) {
                return;
            }

            updateNpmVersion(selectedNpmPackage.name, desiredVersion);
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
