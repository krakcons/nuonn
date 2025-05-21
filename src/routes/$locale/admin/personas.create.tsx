import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/admin/personas/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/admin/personas/create"!</div>
}
