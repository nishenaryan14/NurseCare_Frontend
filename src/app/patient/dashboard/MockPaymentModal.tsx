"use client";
import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCardIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface MockPaymentModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export default function MockPaymentModal({ open, onClose, booking, onSuccess }: MockPaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [cardholderName, setCardholderName] = useState('John Doe');

  useEffect(() => {
    if (open && booking && booking.id) {
      setLoading(true);
      api.post('/payments/create-intent', { bookingId: booking.id })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setPaymentData(res.data);
        })
        .catch(() => toast.error('Could not initialize payment'))
        .finally(() => setLoading(false));
    } else {
      setClientSecret(null);
      setPaymentData(null);
      setLoading(false);
    }
  }, [open, booking]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSecret) return;

    setProcessing(true);
    
    try {
      // Simulate payment processing with mock payment method
      const mockPaymentMethod = {
        card: {
          number: cardNumber.replace(/\s/g, ''),
          expiry: expiryDate,
          cvv: cvv,
          name: cardholderName
        }
      };

      const result = await api.post('/payments/process-mock-payment', {
        clientSecret,
        paymentMethod: mockPaymentMethod
      });

      toast.success('Payment successful!');
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Payment failed';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto w-full p-6 z-10">
          <Dialog.Title className="text-lg font-bold mb-4 flex items-center">
            <CreditCardIcon className="h-6 w-6 mr-2 text-blue-600" />
            Mock Payment Gateway
          </Dialog.Title>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading payment...</p>
            </div>
          ) : paymentData ? (
            <div>
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">₹{paymentData.amount}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Currency:</span>
                  <span className="text-sm">{paymentData.currency}</span>
                </div>
                {paymentData.mockPayment && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                    <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                    This is a mock payment for testing purposes
                  </div>
                )}
              </div>

              {/* Mock Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Test Cards Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-900 mb-1">Test Cards:</p>
                  <p className="text-blue-800">• 4111 1111 1111 1111 (Success)</p>
                  <p className="text-blue-800">• 4000 0000 0000 0002 (Decline)</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    loading={processing} 
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processing ? 'Processing...' : `Pay ₹${paymentData.amount}`}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={processing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">Could not load payment</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
