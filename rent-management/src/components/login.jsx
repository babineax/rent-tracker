import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setErrorMsg("Could not retrieve role. Contact admin.");
      return;
    }

    if (profile.role === "landlord") navigate("/dashboard-landlord");
    else if (profile.role === "tenant") navigate("/dashboard-tenant");
    else setErrorMsg("Unknown role.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Login to RentEase</h2>

          {errorMsg && (
            <div className="text-sm text-red-500 mb-3 text-center">{errorMsg}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-red-500 hover:underline">
              Sign up here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;



