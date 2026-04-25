import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { petsApi } from '../../api/pets';

interface QRShareModalProps {
  petId: number;
  petName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRShareModal({ petId, petName, isOpen, onClose }: QRShareModalProps) {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadToken();
      setCopied(false);
    }
  }, [isOpen, petId]);

  const loadToken = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await petsApi.getQrToken(petId);
      setQrToken(data.qr_token);
    } catch (err: any) {
      setError('No se pudo generar el token temporal.');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = qrToken ? `${window.location.origin}/pets/by-qr-token/${qrToken}` : '';

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[var(--color-foreground)]">Ficha de {petName}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Muestra este código al veterinario para darle acceso temporal.
          </p>
        </div>

        <div className="flex justify-center mb-6 min-h-[200px] items-center">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-green)]"></div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : qrToken ? (
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <QRCodeSVG value={shareUrl} size={200} level="H" includeMargin={false} />
            </div>
          ) : null}
        </div>

        {qrToken && (
          <div className="flex flex-col space-y-3">
            <p className="text-xs text-center text-[var(--color-brand-blue)] font-medium">
              Válido por 15 minutos
            </p>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-background)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] font-medium rounded-lg border border-[var(--color-border)] transition-colors focus:outline-none"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar enlace directo</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
