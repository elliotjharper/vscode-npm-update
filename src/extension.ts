import * as vscode from 'vscode';
import { readNpmDependencies } from './read-npm-package';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'elltg-npm-package-update.updateNpmPackage',
        async () => {
            const npmPackages = await readNpmDependencies();

            const selectedNpmPackage = await vscode.window.showQuickPick(
                npmPackages.map((npmPackage) => `${npmPackage.name}: ${npmPackage.version}`)
            );

            if (!selectedNpmPackage) {
                vscode.window.showInformationMessage(
                    'You did not select an npm package. Exiting...'
                );
                return;
            }

            vscode.window.showInformationMessage(
                `Selected npm package to update: [${selectedNpmPackage}]`
            );

            // const activeTerminal = vscode.window.activeTerminal;
            // if (activeTerminal) {
            //     activeTerminal.show();
            //     activeTerminal.sendText(`npm run ${selectedNpmScript}`);
            // } else {
            //     vscode.window.showInformationMessage('No active terminal. Exiting...');
            // }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
