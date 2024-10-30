import { cn } from "@prex0/uikit/styles";
import { ConnectButton as ConnectButtonRainboKit } from '@rainbow-me/rainbowkit';

export function ConnectButton({ children, className }: { children: React.ReactNode, className?: string  }) {
  return (<ConnectButtonRainboKit.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted
    }) => {
      // Note: If your app doesn't use authentication, you
      // can remove all 'authenticationStatus' checks
      const ready = mounted && authenticationStatus !== 'loading'
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus || authenticationStatus === 'authenticated')

      return (
        <div
          className={cn(className)}
        >
          {(() => {
            if (!connected) {
              return (
                <button onClick={openConnectModal} type="button">
                  {children}
                </button>
              )
            }

            if (chain.unsupported) {
              return (
                <button onClick={openChainModal} type="button">
                  Wrong network
                </button>
              )
            }

            return (
              <div className="flex justify-between items-center space-x-4 text-base">
                <button onClick={openChainModal} type="button">
                  {chain.hasIcon && (
                    <div className="w-[18px] h-[18px]">
                      {chain.iconUrl && (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          className="w-[18px] h-[18px]"
                        />
                      )}
                    </div>
                  )}
                </button>

                <button
                  onClick={openAccountModal}
                  type="button"
                  className="flex"
                >
                  {account.address.slice(0, 6)}…{account.address.slice(38)}
                </button>
              </div>
            )
          })()}
        </div>
      )
    }}
  </ConnectButtonRainboKit.Custom>)
}
  