import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmbeddedWallet, CreateWalletButton, RestoreWalletButton } from "@prex0/uikit/wallet";
import { Address, MyCode } from "@prex0/uikit/identity";
import { useState } from "react";

/**
 * Header is the main header of the app
 */
export function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  return (
    <header className="w-full shadow-md p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">🔄</span>
          <span className="text-xl font-semibold text-gray-200">SwapApp</span>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                <EmbeddedWallet walletCreationComponent={<div>Sign in</div>}>
                  <Address />
                </EmbeddedWallet>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sign in</DialogTitle>
                <DialogDescription>
                  Create a new passkey wallet on Arbitrum.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center">
                <EmbeddedWallet walletCreationComponent={<div>
                  <div className="flex flex-col items-center space-y-2">
                  <CreateWalletButton buttonText="Create Wallet" className="w-40">
                    <Button className="w-full">Create New Wallet</Button>
                  </CreateWalletButton>
                  <RestoreWalletButton buttonText="Restore Wallet" className="w-40">
                    <Button className="w-full" variant="outline">Already have a wallet?</Button>
                  </RestoreWalletButton>
                  </div>
                </div>}>
                  <div className="flex flex-col items-center">
                    <MyCode />
                  </div>
                  <Address isSliced={false} />
                </EmbeddedWallet>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
