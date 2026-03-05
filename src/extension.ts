import * as vscode from "vscode";
import Luminexis from "./Luminexis";

let luminexisInstance: Luminexis | undefined;

export function activate(context: vscode.ExtensionContext): void {
  console.log("Luminexis extension is now active");

  // Create Luminexis instance with default settings
  luminexisInstance = new Luminexis({
    timeout: 60000, // 1 minute
    warning: 10000, // 10 seconds warning before timeout
    immediate: true,
  });

  // Listen for warning event
  luminexisInstance.on("warning", () => {
    vscode.window.showWarningMessage("Luminexis: You will be logged out soon due to inactivity");
  });

  // Listen for idle event
  luminexisInstance.on("idle", () => {
    vscode.window.showInformationMessage("Luminexis: Session timed out due to inactivity");
  });

  // Register the show info command
  const disposable = vscode.commands.registerCommand("luminexis.showInfo", () => {
    vscode.window.showInformationMessage("Luminexis: Idle detection library is active");
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  if (luminexisInstance) {
    luminexisInstance.stop();
    luminexisInstance.destroy();
    luminexisInstance = undefined;
  }
}
