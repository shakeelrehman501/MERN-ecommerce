import { Loader2 } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );
}

export default PageLoader;