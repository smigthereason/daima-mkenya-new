// components/InquiryModal.tsx
import { useState } from "react";
import { X } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  piece: {
    _id: string;
    name: string;
  };
}

export default function InquiryModal({
  isOpen,
  onClose,
  piece,
}: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceId: piece._id,
          pieceName: piece.name,
          customer: formData,
          userEmail: formData.email,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-light mb-4">Thank You</h3>
            <p className="text-gray-600">
              Your inquiry has been received. Our team will contact you shortly.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-light mb-2">Request Price</h3>
            <p className="text-sm text-gray-500 mb-6">{piece.name}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
