import QRCodeDisplay from '@/components/admin/QRCodeDisplay';

export default function QRCodePage() {
  // todo: replace with actual deployed URL
  const menuUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/menu`
    : '/menu';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">QR Code</h1>
        <p className="text-muted-foreground">Share your digital menu</p>
      </div>

      <QRCodeDisplay menuUrl={menuUrl} />
    </div>
  );
}
