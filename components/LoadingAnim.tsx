import { Loader2 } from "lucide-react";

function LoadingAnim() {
  return (
    <div className="grid place-content-center min-h-screen">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export default LoadingAnim;
