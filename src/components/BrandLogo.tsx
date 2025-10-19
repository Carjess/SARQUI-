import { Link } from "react-router-dom";

export default function BrandLogo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="text-2xl font-bold text-primary">
        SARQUI
      </div>
    </Link>
  );
}