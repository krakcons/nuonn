import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/admin/scenarios/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/admin/scenarios/create"!</div>
}
