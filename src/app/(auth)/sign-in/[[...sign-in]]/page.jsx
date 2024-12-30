import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return <SignIn appearance={{ variables: { colorPrimary: '#0f172a' }}} />
}