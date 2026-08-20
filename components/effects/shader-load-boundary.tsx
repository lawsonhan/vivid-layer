"use client"

import {
  Component,
  Suspense,
  type ErrorInfo,
  type ReactNode,
} from "react"

interface ShaderErrorBoundaryProps {
  children: ReactNode
}

interface ShaderErrorBoundaryState {
  failed: boolean
}

class ShaderErrorBoundary extends Component<
  ShaderErrorBoundaryProps,
  ShaderErrorBoundaryState
> {
  state: ShaderErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ShaderErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Shader failed to initialize.", error, info.componentStack)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function ShaderLoadBoundary({ children }: ShaderErrorBoundaryProps) {
  return (
    <ShaderErrorBoundary>
      <Suspense fallback={null}>{children}</Suspense>
    </ShaderErrorBoundary>
  )
}
