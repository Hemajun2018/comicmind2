import type { Metadata } from 'next'
import { TestAuthContent } from './TestAuthContent'

export const metadata: Metadata = {
  title: 'Authentication Test - ComicMind',
  description: 'Test authentication functionality and daily limits',
}

export default function TestAuthPage() {
  return <TestAuthContent />
} 