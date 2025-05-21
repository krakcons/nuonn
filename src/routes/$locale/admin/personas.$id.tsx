import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/admin/personas/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/admin/personas/$id"!</div>
}
