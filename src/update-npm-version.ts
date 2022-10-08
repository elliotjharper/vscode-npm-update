import * as fs from 'fs';
import { getWorkspacePackageJsonPath } from './get-package-json-path';

export function updateNpmVersion(name: string, version: string): void {
    const workspacePackageJsonPath = getWorkspacePackageJsonPath().fsPath;

    const packageJsonFile = fs.readFileSync(workspacePackageJsonPath, 'utf8');

    const regexpPattern = `"${name.replace('/', '\\/')}":\\s*"\\S+"`;
    const existingPackageRegex = new RegExp(regexpPattern, 'gm');

    const found = packageJsonFile.match(existingPackageRegex);
    if (!found) {
        throw new Error(`Could not find package ${name} in your package.json`);
    }

    const updated = packageJsonFile.replace(existingPackageRegex, `"${name}": "${version}"`);

    fs.writeFileSync(workspacePackageJsonPath, updated, 'utf8');
}
