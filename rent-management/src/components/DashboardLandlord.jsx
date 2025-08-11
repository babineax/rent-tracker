import { Card, CardContent } from "@/components/ui/card";

function DashboardLandlord() {
  return (
    <div className="min-h-screen bg-muted px-4 py-10 flex justify-center items-start">
      <Card className="w-full max-w-3xl">
        <CardContent className="space-y-4">
          <h1 className="text-3xl font-bold text-red-500">Landlord Dashboard</h1>
          <p className="text-gray-600">
            Welcome! Here you will manage properties, tenants, and lease details. More features will be available as your team integrates them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardLandlord;

