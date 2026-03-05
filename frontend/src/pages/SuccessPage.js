import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Check, Loader2, AlertCircle, CreditCard, Key, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function SuccessPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [submission, setSubmission] = useState(location.state?.submission || null);
  const [paymentInfo, setPaymentInfo] = useState(location.state?.paymentInfo || null);

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else if (submission) {
      setPaymentStatus('success');
    }
  }, [sessionId, submission]);

  const pollPaymentStatus = useCallback(async (sid, attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/payments/status/${sid}`);
      const data = response.data;

      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sid, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => pollPaymentStatus(sid, attempts + 1), pollInterval);
    }
  }, []);

  // Show payment required state when Stripe is not integrated
  if (paymentInfo && paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fb6c1d]/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-[#fb6c1d]" />
            </div>
            <h1 className="font-heading text-3xl font-bold uppercase text-white mb-4">
              Payment Required
            </h1>
            <p className="text-white/60 mb-6">
              {paymentInfo.message}
            </p>
            
            <div className="bg-[#0b0b0b] rounded-xl p-4 text-left mb-6 space-y-4">
              <div>
                <h3 className="font-heading font-bold text-[#fb6c1d] uppercase mb-2">Your Player Key</h3>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <Key className="w-5 h-5 text-white/60" />
                  <code className="text-lg font-mono text-white">{paymentInfo.playerKey}</code>
                </div>
                <p className="text-xs text-white/50 mt-1">Save this! You'll need it to log in.</p>
              </div>
              
              <div>
                <h3 className="font-heading font-bold text-[#fb6c1d] uppercase mb-2">Package Price</h3>
                <p className="text-2xl font-bold text-white">${paymentInfo.packagePrice}</p>
              </div>
              
              {paymentInfo.tempPassword && (
                <div>
                  <h3 className="font-heading font-bold text-[#fb6c1d] uppercase mb-2">Temporary Password</h3>
                  <p className="text-sm font-mono text-white/70">{paymentInfo.tempPassword}</p>
                  <p className="text-xs text-white/50 mt-1">Change this after your first login</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <a 
                href="mailto:support@hoopwithher.com?subject=Payment for Player Profile"
                className="block"
              >
                <Button className="btn-secondary w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Contact Us to Complete Payment
                </Button>
              </a>
              
              <Link to="/player/login">
                <Button variant="outline" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In to Your Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Questions? Contact us at{' '}
              <a href="mailto:support@hoopwithher.com" className="text-[#fb6c1d] hover:underline">
                support@hoopwithher.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 text-center">
          {paymentStatus === 'checking' && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#0134bd]/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-[#0134bd] animate-spin" />
              </div>
              <h1 className="font-heading text-3xl font-bold uppercase text-white mb-4">
                Processing Payment
              </h1>
              <p className="text-white/60">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-heading text-3xl font-bold uppercase text-white mb-4">
                Submission Complete!
              </h1>
              <p className="text-white/60 mb-6">
                Thank you for registering with Hoop With Her Player Advantage™. 
                You will receive a confirmation email shortly.
              </p>
              <div className="bg-[#0b0b0b] rounded-xl p-4 text-left mb-6">
                <h3 className="font-heading font-bold text-[#fb6c1d] uppercase mb-3">What Happens Next</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[#fb6c1d]">1.</span>
                    Our team will review your submission
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#fb6c1d]">2.</span>
                    We'll begin creating your recruiting materials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#fb6c1d]">3.</span>
                    You'll receive your deliverables via email
                  </li>
                </ul>
              </div>
              <Link to="/intake">
                <Button className="btn-primary w-full">
                  Submit Another Player
                </Button>
              </Link>
            </>
          )}

          {(paymentStatus === 'expired' || paymentStatus === 'timeout') && (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <h1 className="font-heading text-3xl font-bold uppercase text-white mb-4">
                Payment Issue
              </h1>
              <p className="text-white/60 mb-6">
                {paymentStatus === 'expired' 
                  ? 'Your payment session has expired. Please try again.'
                  : 'Unable to confirm payment. Please check your email or contact support.'}
              </p>
              <Link to="/intake">
                <Button className="btn-secondary w-full">
                  Try Again
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:support@hoopwithher.com" className="text-[#fb6c1d] hover:underline">
              support@hoopwithher.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
