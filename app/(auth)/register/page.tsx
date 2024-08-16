"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [errors, setErrors] = React.useState<{
		username?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const validateForm = () => {
		const newErrors: {
			username?: string;
			email?: string;
			password?: string;
			confirmPassword?: string;
		} = {};
		if (!username) newErrors.username = "Username is required";
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";
		else if (password.length < 8)
			newErrors.password = "Password must be at least 8 characters long";
		if (password !== confirmPassword)
			newErrors.confirmPassword = "Passwords do not match";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const router = useRouter(); 

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validateForm()) {
			console.log("Form submitted");
			// POST DATA 
			router.push('/dashboard');
		}
	};

	return (
		<>
			<Link className="text-blue-500 hover:underline" href="/">
				Home
			</Link>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<div className="p-8 bg-white rounded-lg shadow-md w-96">
					<Logo />
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<Input
								type="text"
								placeholder="Username"
								required
								value={username}
								onChange={(event) => setUsername(event.target.value)}
							/>
							{errors.username && (
								<p className="text-red-500 text-sm mt-1">{errors.username}</p>
							)}
						</div>
						<div>
							<Input
								type="email"
								placeholder="Email"
								required
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">{errors.email}</p>
							)}
						</div>
						<div>
							<Input
								type="password"
								placeholder="Password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">{errors.password}</p>
							)}
						</div>
						<div>
							<Input
								type="password"
								placeholder="Confirm Password"
								required
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							/>
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-1">
									{errors.confirmPassword}
								</p>
							)}
						</div>
						<Button type="submit" className="w-full">
							Register
						</Button>
					</form>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link href="/login" className="text-blue-600 hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}