import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Token } from "@prex0/prex-client"

/**
 * TokenSelector is a component that allows the user to select a token
 */
export function TokenSelector({
  token,
  setToken,
  options
}: {
  token?: Token;
  setToken?: (token: Token) => void;
  options?: Token[];
}) {
  if (!options || !setToken || !token) {
    return null;
  }

  return (
    <Select value={token.symbol} onValueChange={(value) => setToken(options.find((t) => t.symbol === value)!)}>
      <SelectTrigger className="w-[120px] h-full bg-black/30 border-gray-800/50 text-gray-300">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border border-gray-700 flex flex-col">
        {options.map((token) => (
          <SelectItem value={token.symbol} className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">{token.symbol}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
