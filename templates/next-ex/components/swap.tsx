import { Swap, SwapToggleButton, SwapButton, SwapMessage, SwapAmountSimpleInput, SwapBalance, SwapTokenSelector } from "@prex0/uikit/swap"
import { Header } from "./header"
import { ArrowDown, Info, Zap } from "lucide-react"
import { USDC_TOKEN_ARBITRUM, WETH_TOKEN_ARBITRUM } from "@prex0/uikit";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TokenSelector } from "./token-selector";
import { CustomButton } from "./custom-button";

export function SwapPage() {
  return <div className="min-h-screen bg-prex-default text-gray-300 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <Swap>

        <Card className="w-full max-w-md bg-black/50 backdrop-blur-md shadow-2xl border-gray-800/50">
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Efficient. Streamlined. Redefined.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-amount" className="text-gray-400">You pay</Label>
                <div className="flex space-x-2">
                  <SwapAmountSimpleInput type="from" amount="0" className="h-10 bg-black/30 border border-gray-800/50 text-gray-300 rounded-md"/>
                  <SwapTokenSelector
                    type="from"
                    token={USDC_TOKEN_ARBITRUM}
                  >
                    <TokenSelector />
                  </SwapTokenSelector>
                </div>
                <div>
                  <SwapBalance type="from" className="text-gray-400 text-sm"/>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-2">
                <SwapToggleButton className="h-6 w-6">
                  <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50">
                    <ArrowDown className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Switch tokens</span>
                  </Button>
                  </SwapToggleButton>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                        <span>No</span>
                        <Zap className="h-3 w-3" />
                        <span>with Intent Order</span>
                        <Info className="h-3 w-3" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This transaction uses Intent Orders, eliminating gas fees for users.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-amount" className="text-gray-400">You receive</Label>
                <div className="flex space-x-2">
                  <SwapAmountSimpleInput type="to" amount="0" className="bg-black/30 border border-gray-800/50 text-gray-300 rounded-md"/>
                  <SwapTokenSelector
                    type="to"
                    token={WETH_TOKEN_ARBITRUM}
                  >
                    <TokenSelector />
                  </SwapTokenSelector>
                </div>
                <div>
                  <SwapBalance type="to" className="text-gray-400 text-sm"/>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col pt-6">
            <SwapMessage className="text-xs text-gray-500"/>
            <SwapButton className="w-full">
              <CustomButton>Swap</CustomButton>
            </SwapButton>
          </CardFooter>
        </Card>
        </Swap>
      </main>
  </div>
}