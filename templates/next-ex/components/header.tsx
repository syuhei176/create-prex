import { ConnectButton } from "./connect-button";

/**
 * Header is the main header of the app
 */
export function Header() {
  return (
    <header className="w-full shadow-md p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">🔄</span>
          <span className="text-xl font-semibold text-gray-200">SwapApp</span>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton className="px-3 py-2 rounded-md w-full bg-white/5 hover:bg-white/10 border border-gray-800/50">
            Connect Wallet
          </ConnectButton>
        </div>
      </div>
    </header>
  );
}
