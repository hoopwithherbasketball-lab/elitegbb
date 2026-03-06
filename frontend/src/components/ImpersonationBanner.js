import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ImpersonationBanner() {
  const { isImpersonating, originalAdmin, user, exitImpersonation } = useAuth();

  if (!isImpersonating || !user) {
    return null;
  }

  const handleExitImpersonation = async () => {
    try {
      await exitImpersonation();
      toast.success('Returned to admin account');
      // Redirect back to admin dashboard
      window.location.href = '/admin';
    } catch (error) {
      console.error('Error exiting impersonation:', error);
      toast.error('Failed to return to admin account');
    }
  };

  const userType = user.role === 'coach' ? 'Coach' : 'Player';
  const userName = user.name || user.player_name || user.email || user.player_key;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0134bd] to-[#fb6c1d] text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="font-medium text-sm">Admin Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">
              Viewing as <strong>{userType}</strong>: {userName}
            </span>
          </div>
          {originalAdmin?.user?.email && (
            <span className="text-xs text-white/70 hidden md:inline">
              (Admin: {originalAdmin.user.email})
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExitImpersonation}
          className="bg-white text-[#0134bd] hover:bg-white/90 font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Exit to Admin
        </Button>
      </div>
    </div>
  );
}
