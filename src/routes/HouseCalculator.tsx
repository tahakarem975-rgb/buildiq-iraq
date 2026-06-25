import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/HouseCalculator')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/HouseCalculator"!</div>
}
