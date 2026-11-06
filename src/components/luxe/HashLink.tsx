import type { AnchorHTMLAttributes } from 'react'
import { Link, useLocation } from 'react-router-dom'

// A link to a section of the homepage. On the homepage it is a plain anchor;
// elsewhere (e.g. /terms) it routes back to "/" and ScrollToTop scrolls to the section.
export default function HashLink({ to, ...rest }: { to: `#${string}` } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { pathname } = useLocation()
  if (pathname === '/') return <a href={to} {...rest} />
  return <Link to={{ pathname: '/', hash: to }} {...rest} />
}
