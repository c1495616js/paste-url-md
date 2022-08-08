import * as vscode from 'vscode';
import { copyPaste } from './utils/copy-paste';

export default class PasteLinkMD {
  public async paste() {
    try {
      await this.start();
    } catch (err) {
      this.showErrorMessage(err as Error);
    }
  }

  async start() {
    const copiedText = await this.getCopiedUrl();
    if (copiedText) {
      this.writeToEditor(copiedText);
    }
  }

  private async getCopiedUrl(): Promise<string | undefined> {
    const content = await copyPaste().catch((error) => {
      throw error;
    });

    return this.parseURL(content);
  }

  // write to editor
  private writeToEditor(copiedText: string) {
    if (vscode.window.activeTextEditor) {
      const selection = vscode.window.activeTextEditor.selection;
      let startLine = vscode.window.activeTextEditor.selection.start.line;
      let startPosition = new vscode.Position(
        startLine,
        selection.start.character
      );

      let endLine = vscode.window.activeTextEditor.selection.end.line;
      let endPosition = new vscode.Position(endLine, selection.end.character);
      vscode.window.activeTextEditor.edit((editBuilder) => {
        editBuilder.insert(startPosition, '[');
        editBuilder.insert(endPosition, `](${copiedText})`);
      });
    }
  }

  private parseURL(urlString: string): string | undefined {
    try {
      const url = new URL(urlString);
      return url.href;
    } catch (err) {
      throw new Error('Please copy a valid url');
    }
  }

  showErrorMessage(err: Error) {
    vscode.window.showErrorMessage(err.message);
  }
}
