import { Link } from 'react-router-dom';
export default function TagPill({ tag }) {
  if (!tag) return null;
  return <Link className="tag-pill" to={`/tag/${tag.slug}`}>#{tag.name}</Link>;
}
