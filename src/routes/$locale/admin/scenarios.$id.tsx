import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/admin/scenarios/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/admin/scenarios/$id"!</div>
}
