import { serviceConfig, statusBannerCopy } from "@/lib/config/site";

export function StatusBanner() {
  const copy = statusBannerCopy[serviceConfig.status];

  if (!copy) {
    return null;
  }

  return (
    <div className="status-banner" role="status">
      {copy}
    </div>
  );
}
