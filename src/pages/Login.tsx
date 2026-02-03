import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function UserLogin() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const updateCredential = (field: string, value: string) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const handleAuthError = (error: any, context: string) => {
        console.error(`Auth error during ${context}:`, error);
        toast.error(error.message || `Failed to ${context}`);
    };

    const performSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error: any) {
            handleAuthError(error, "login");
        } finally {
            setIsProcessing(false);
        }
    };

    const performGoogleSignIn = async () => {
        setIsProcessing(true);
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error: any) {
            handleAuthError(error, "login with Google");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Verify your identity to access the dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={performSignIn}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={credentials.email}
                                onChange={(e) => updateCredential("email", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => updateCredential("password", e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                            {isProcessing ? "Verifying..." : "Sign In"}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Alternative Methods
                                </span>
                            </div>
                        </div>
                        <Button type="button" variant="outline" className="w-full" disabled={isProcessing} onClick={performGoogleSignIn}>
                            Sign in with Google
                        </Button>
                        <div className="text-sm text-center text-gray-500">
                            New to ChemViz?{" "}
                            <Link to="/signup" className="text-primary hover:underline">
                                Create an account
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
