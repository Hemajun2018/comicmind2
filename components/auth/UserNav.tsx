import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuShortcut 
} from '@/components/ui/dropdown-menu'

interface UserNavProps {
  user: {
    user_metadata: {
      full_name?: string;
    };
    email?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {user.user_metadata.full_name ?? 'User'}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/dashboard" passHref>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
} 