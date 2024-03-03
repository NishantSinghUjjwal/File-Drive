import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs"

export const Header = () => {
    return <div className=" border-b flex justify-between p-4 sticky top-0">
        <div>FileDrive</div>
        <div className=" flex gap-2">
            <OrganizationSwitcher />
            <UserButton />
            <SignedOut>
                <SignInButton>
                    <Button>Sign In</Button>
                </SignInButton>
            </SignedOut>
        </div>
    </div>
}