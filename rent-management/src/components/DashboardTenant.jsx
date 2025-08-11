import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DashboardTenant() {
  return (
    <div className="min-h-screen bg-muted p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/rentease-logo.jpg" alt="RentEase" />
            <AvatarFallback>RE</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold">RentEase Tenant Dashboard</h1>
        </div>
        <Button variant="ghost">Logout</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="font-semibold text-lg">Rent Log</h2>
            <p className="text-muted-foreground">Track your payments and balances.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold text-lg">Lease Info</h2>
            <p className="text-muted-foreground">View your current lease agreement.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold text-lg">Maintenance</h2>
            <p className="text-muted-foreground">Raise and track repair requests.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold text-lg">Settings</h2>
            <p className="text-muted-foreground">Update your profile and notifications.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardTenant;

