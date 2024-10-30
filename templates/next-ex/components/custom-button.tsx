import { Button } from "@/components/ui/button"

export function CustomButton({ disabled, isLoading, onClick, children }: { disabled?: boolean, isLoading?: boolean, onClick?: () => void, children: React.ReactNode }) {
  return <Button
    disabled={disabled}
    onClick={onClick}
    className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 rounded-md text-gray-300"
  >{isLoading ? 'Loading...' : children}</Button>
}
